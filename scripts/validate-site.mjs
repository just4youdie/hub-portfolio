#!/usr/bin/env node
// Site-specific checks that a generic HTML validator can't know about.
// Runs against the built folder (default: _site/), i.e. exactly what ships.
//
//   ERRORS   (fail CI, block deploy)  - things visitors would hit as broken
//   WARNINGS (reported, never block)  - unfinished content / housekeeping
//
// Usage: node scripts/validate-site.mjs [dir]   (or: npm run validate)

import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// ---- Budgets (tune here) ---------------------------------------------------
const BUDGET = {
  imageKB: 400,  // full-size covers (README: up to 1400px wide, WebP)
  thumbKB: 120,  // images/**/thumbs/* - grid tiles + homepage mosaic
  fileMB: 10,    // anything else (e.g. PDFs in files/) - warning only
};
const KNOWN_PROJECT_KEYS = new Set([
  'id', 'title', 'tags', 'link', 'image', 'description', 'fit', 'downloadUrl', 'viewUrl',
]);
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i; // http:, mailto:, data:, //cdn...
const PLACEHOLDER_HTML = /\[(?:[A-Z][A-Za-z0-9 '&.-]{1,60}|https?:\/\/[^\]\s]+)\]/g;
const PLACEHOLDER_TEXT = /\[[^\]]{3,}\]/;

// ---- Reporting ----------------------------------------------------------------
const SITE = path.resolve(process.argv[2] ?? '_site');
const errors = [];
const warnings = [];
const inCI = !!process.env.GITHUB_ACTIONS;

function report(level, file, line, msg) {
  (level === 'error' ? errors : warnings).push({ file, line, msg });
  if (inCI) {
    const loc = `file=${file}${line ? `,line=${line}` : ''}`;
    console.log(`::${level === 'error' ? 'error' : 'warning'} ${loc}::${msg}`);
  }
}
const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const lineOf = (text, needle) => {
  const i = text.indexOf(needle);
  return i === -1 ? undefined : lineAt(text, i);
};

// ---- Inventory ----------------------------------------------------------------
const files = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs);
    else files.add(path.relative(SITE, abs).split(path.sep).join('/'));
  }
})(SITE);
const read = (rel) => readFileSync(path.join(SITE, rel), 'utf8');
const sizeKB = (rel) => statSync(path.join(SITE, rel)).size / 1024;
const referenced = new Set();

// Resolve a local URL (relative to `fromFile`) to a site-relative path.
function resolveLocal(url, fromFile) {
  const clean = decodeURI(url.split('#')[0].split('?')[0]);
  if (!clean) return null; // pure "#anchor" or "?query"
  const base = clean.startsWith('/') ? '' : path.posix.dirname(fromFile);
  let target = path.posix.normalize(path.posix.join(base, clean)).replace(/^\/+/, '');
  if (target === '.' || target.endsWith('/')) target = `${target === '.' ? '' : target}index.html`;
  return target;
}

// ---- 1. HTML pages: local links, leftover placeholders -------------------------
const pages = [...files].filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const raw = read(page);
  // Blank out comments but keep offsets so line numbers stay correct.
  const html = raw.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));

  for (const m of html.matchAll(/\b(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const url = (m[2] ?? m[3]).trim();
    const line = lineAt(html, m.index);
    if (!url || url.startsWith('#')) continue; // e.g. <img src=""> filled in by script.js

    if (/^https?:\/\/(www\.)?instagram\.com\/?$/i.test(url)) {
      report('warning', page, line, 'Instagram link points at instagram.com itself, not a profile.');
    }
    if (EXTERNAL.test(url) || url.startsWith('[')) continue; // [placeholders] reported below

    const target = resolveLocal(url, page);
    if (!target) continue;
    referenced.add(target);
    if (!files.has(target)) report('error', page, line, `Broken link: "${url}" (${target} is not in the site).`);
  }

  for (const m of html.matchAll(PLACEHOLDER_HTML)) {
    report('error', page, lineAt(html, m.index), `Unreplaced template placeholder ${m[0]}.`);
  }
}

// ---- 2. script.js: syntax + PROJECTS data ----------------------------------------
const SCRIPT = 'script.js';
let PROJECTS = null;
if (!files.has(SCRIPT)) {
  report('error', SCRIPT, undefined, 'script.js is missing.');
} else {
  const src = read(SCRIPT);
  try {
    new vm.Script(src, { filename: SCRIPT });
  } catch (e) {
    const line = Number((e.stack.match(/script\.js:(\d+)/) || [])[1]) || undefined;
    report('error', SCRIPT, line, `JavaScript syntax error: ${e.message}`);
  }

  const literal = extractObjectLiteral(src, 'const PROJECTS =');
  if (!literal) {
    report('error', SCRIPT, undefined, 'Could not find the `const PROJECTS = { ... }` block.');
  } else {
    try {
      PROJECTS = vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 });
    } catch (e) {
      report('error', SCRIPT, lineOf(src, 'const PROJECTS'), `PROJECTS could not be evaluated: ${e.message}`);
    }
  }

  if (PROJECTS) checkProjects(PROJECTS, src);
}

function checkProjects(projects, src) {
  const seenIds = new Map();
  const workHtml = files.has('work.html') ? read('work.html') : '';
  const tabs = new Set([...workHtml.matchAll(/data-tab="([^"]+)"/g)].map((m) => m[1]));

  for (const [category, list] of Object.entries(projects)) {
    if (workHtml && !tabs.has(category)) {
      report('warning', 'work.html', undefined, `PROJECTS has a "${category}" category but work.html has no data-tab="${category}" button, so it can't be opened.`);
    }
    if (!Array.isArray(list)) {
      report('error', SCRIPT, lineOf(src, `${category}:`), `PROJECTS.${category} must be an array.`);
      continue;
    }
    const isCommission = category === 'commissions';

    list.forEach((p, i) => {
      const label = `PROJECTS.${category}[${i}]${p?.title ? ` "${p.title}"` : ''}`;
      const line = lineOf(src, p?.id ? `'${p.id}'` : `'${p?.title}'`);
      const err = (msg) => report('error', SCRIPT, line, `${label}: ${msg}`);
      const warn = (msg) => report('warning', SCRIPT, line, `${label}: ${msg}`);

      if (!p || typeof p !== 'object') return err('entry is not an object.');
      for (const k of Object.keys(p)) if (!KNOWN_PROJECT_KEYS.has(k)) warn(`unknown field "${k}" (typo?) - it will be ignored.`);
      if (typeof p.title !== 'string' || !p.title.trim()) err('missing "title".');
      if (!Array.isArray(p.tags) || p.tags.length === 0) warn('has no tags, so search can never find it.');

      // id - required everywhere except commissions, must be unique + URL-safe
      if (!isCommission) {
        if (!p.id) err('missing "id" (needed for project.html?id=...).');
        else if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(p.id)) err(`id "${p.id}" must be URL-safe (letters, digits, - or _; no spaces).`);
        else if (seenIds.has(p.id)) err(`id "${p.id}" is already used by ${seenIds.get(p.id)}.`);
        else seenIds.set(p.id, label);
      }

      // link - commissions point at an internal page; everything else at http(s) or ''
      if (isCommission) {
        const target = p.link && !EXTERNAL.test(p.link) ? resolveLocal(p.link, SCRIPT) : null;
        if (!target) err('commission "link" must be the filename of its own page, e.g. commission-acme.html.');
        else if (!files.has(target)) err(`links to "${p.link}", which doesn't exist (or is excluded by .deployignore).`);
        else referenced.add(target);
      } else if (p.link && !/^https?:\/\//i.test(p.link)) {
        err(`"link" must start with http(s):// or be '' (got "${p.link}").`);
      }

      // image + its thumbs/ twin (grid tiles and the homepage mosaic use the thumb)
      if (p.image) {
        const img = resolveLocal(p.image, SCRIPT);
        const thumb = img.replace(/\/([^/]+)$/, '/thumbs/$1');
        referenced.add(img);
        referenced.add(thumb);
        if (!files.has(img)) err(`image "${p.image}" doesn't exist.`);
        if (!files.has(thumb)) err(`missing thumbnail "${thumb}" (same filename, inside a thumbs/ folder).`);
        if (!/\.(webp|svg)$/i.test(img)) warn(`image "${p.image}" isn't WebP - convert it to keep pages light.`);
      }
      if (p.fit && !['contain', 'cover'].includes(p.fit)) warn(`fit "${p.fit}" isn't 'contain' or 'cover'.`);

      for (const key of ['downloadUrl', 'viewUrl']) {
        const url = p[key];
        if (!url || EXTERNAL.test(url)) continue;
        const target = resolveLocal(url, SCRIPT);
        referenced.add(target);
        if (!files.has(target)) err(`${key} "${url}" doesn't exist.`);
      }

      if (!isCommission && typeof p.description === 'string' && PLACEHOLDER_TEXT.test(p.description)) {
        warn('description is still placeholder text - visitors will see it.');
      }
    });
  }
}

// ---- 3. Asset weight + orphans ------------------------------------------------
for (const f of files) {
  const kb = sizeKB(f);
  if (/^images\/.*\.(webp|png|jpe?g|gif|avif)$/i.test(f)) {
    const isThumb = f.includes('/thumbs/');
    const limit = isThumb ? BUDGET.thumbKB : BUDGET.imageKB;
    if (kb > limit) report('error', f, undefined, `${Math.round(kb)} KB is over the ${limit} KB ${isThumb ? 'thumbnail' : 'image'} budget - resize/compress it (see README "Image sizes and formats").`);
  } else if (kb > BUDGET.fileMB * 1024) {
    report('warning', f, undefined, `${(kb / 1024).toFixed(1)} MB - large for a static site; consider compressing it.`);
  }
  if (/^(images|files)\//.test(f) && !referenced.has(f)) {
    report('warning', f, undefined, 'not used by any page or project - remove it or reference it.');
  }
}

// ---- Summary --------------------------------------------------------------------
const fmt = ({ file, line, msg }) => `${file}${line ? `:${line}` : ''} - ${msg}`;
if (!inCI) {
  for (const e of errors) console.error(`✖ ${fmt(e)}`);
  for (const w of warnings) console.warn(`⚠ ${fmt(w)}`);
}
console.log(`\nvalidate-site: ${pages.length} pages, ${files.size} files - ${errors.length} error(s), ${warnings.length} warning(s)`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = (list, icon) => list.map((x) => `| ${icon} | \`${x.file}${x.line ? `:${x.line}` : ''}\` | ${x.msg.replace(/\|/g, '\\|')} |`);
  const md = [
    '### Site checks',
    `${errors.length} error(s), ${warnings.length} warning(s) across ${pages.length} pages.`,
    '',
    ...(errors.length + warnings.length
      ? ['| | Where | What |', '|---|---|---|', ...rows(errors, '❌'), ...rows(warnings, '⚠️')]
      : ['All clear ✅']),
    '',
  ].join('\n');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}
process.exit(errors.length ? 1 : 0);

// ---- helpers ------------------------------------------------------------------
// Returns the `{ ... }` source that follows `marker`, matching braces while
// skipping over strings, template literals and comments.
function extractObjectLiteral(src, marker) {
  const start = src.indexOf('{', src.indexOf(marker));
  if (src.indexOf(marker) === -1 || start === -1) return null;
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i === -1) return null; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; if (i === 0) return null; continue; }
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === '\\') i++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  return null;
}
