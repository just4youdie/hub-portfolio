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
  'id', 'title', 'tags', 'link', 'image', 'images', 'description', 'fit', 'downloadUrl', 'viewUrl', 'i18n',
]);
// The only per-project fields worth translating - tags are shared
// vocabulary and live in i18n.js instead.
const TRANSLATABLE_PROJECT_KEYS = new Set(['title', 'description']);
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
// key -> first place it's used, so a missing translation can be pointed at.
const i18nUsage = new Map();

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

  // --- Translation wiring (see i18n.js) ---
  for (const m of html.matchAll(/\bdata-i18n\s*=\s*"([^"]*)"/g)) {
    const key = m[1].trim();
    const line = lineAt(html, m.index);
    if (!key) report('error', page, line, 'data-i18n is empty - it needs a translation key.');
    else if (!i18nUsage.has(key)) i18nUsage.set(key, { file: page, line });
  }
  for (const m of html.matchAll(/\bdata-i18n-attr\s*=\s*"([^"]*)"/g)) {
    const line = lineAt(html, m.index);
    for (const entry of m[1].split(';')) {
      const pair = entry.trim();
      if (!pair) continue;
      const parts = pair.split(':').map((part) => part.trim());
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        report('error', page, line, `data-i18n-attr entry "${pair}" must look like "attribute:key".`);
        continue;
      }
      if (!i18nUsage.has(parts[1])) i18nUsage.set(parts[1], { file: page, line });
    }
  }

  // A page that forgets i18n.js silently ships in English only.
  const i18nTag = html.indexOf('src="i18n.js"');
  const scriptTag = html.indexOf('src="script.js"');
  if (i18nTag === -1) {
    report('error', page, undefined, 'page never loads i18n.js, so none of its copy can be translated.');
  } else if (scriptTag !== -1 && i18nTag > scriptTag) {
    report('error', page, lineAt(html, i18nTag), 'i18n.js must be loaded before script.js (script.js calls I18N.t at startup).');
  }
  if (!html.includes('class="lang-switch"')) {
    report('error', page, undefined, 'page has no .lang-switch in its header, so visitors cannot change language from it.');
  }
}

// ---- 2. i18n.js: the language dictionaries ------------------------------------
// The site is translated in the browser, so a key that only exists in one
// language shows up as raw "some.key" on the page. These checks make that a
// build failure instead of something a visitor discovers.
const I18N_FILE = 'i18n.js';
let TRANSLATIONS = null;
let TAG_TRANSLATIONS = null;
let LOCALES = [];
let DEFAULT_LOCALE = 'en';

// Placeholders like {tag} are filled in at runtime; if one language drops
// one, that language shows a literal "{tag}" to the visitor.
const placeholdersIn = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');


if (!files.has(I18N_FILE)) {
  report('error', I18N_FILE, undefined, 'i18n.js is missing - every page loads it.');
} else {
  const src = read(I18N_FILE);
  try {
    new vm.Script(src, { filename: I18N_FILE });
  } catch (e) {
    const line = Number((e.stack.match(/i18n\.js:(\d+)/) || [])[1]) || undefined;
    report('error', I18N_FILE, line, `JavaScript syntax error: ${e.message}`);
  }

  const languages = (src.match(/const SUPPORTED_LANGUAGES\s*=\s*(\[[^\]]*\])/) || [])[1];
  const fallback = (src.match(/const DEFAULT_LANGUAGE\s*=\s*'([^']+)'/) || [])[1];
  if (!languages) {
    report('error', I18N_FILE, undefined, 'Could not find `const SUPPORTED_LANGUAGES = [ ... ]`.');
  } else {
    try {
      LOCALES = vm.runInNewContext(languages, {}, { timeout: 1000 });
    } catch (e) {
      report('error', I18N_FILE, lineOf(src, 'SUPPORTED_LANGUAGES'), `SUPPORTED_LANGUAGES could not be read: ${e.message}`);
    }
  }
  if (fallback) DEFAULT_LOCALE = fallback;
  if (LOCALES.length && !LOCALES.includes(DEFAULT_LOCALE)) {
    report('error', I18N_FILE, lineOf(src, 'DEFAULT_LANGUAGE'), `DEFAULT_LANGUAGE "${DEFAULT_LOCALE}" isn't one of SUPPORTED_LANGUAGES.`);
  }

  const literal = extractObjectLiteral(src, 'const TRANSLATIONS =');
  if (!literal) {
    report('error', I18N_FILE, undefined, 'Could not find the `const TRANSLATIONS = { ... }` block.');
  } else {
    try {
      TRANSLATIONS = vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 });
    } catch (e) {
      report('error', I18N_FILE, lineOf(src, 'const TRANSLATIONS'), `TRANSLATIONS could not be evaluated: ${e.message}`);
    }
  }

  if (TRANSLATIONS) checkTranslations(TRANSLATIONS, src);

  // A tag renamed in script.js leaves a translation behind that silently
  // stops applying, so stale entries are worth flagging.
  const tagLiteral = extractObjectLiteral(src, 'const TAG_TRANSLATIONS =');
  if (tagLiteral) {
    try {
      TAG_TRANSLATIONS = vm.runInNewContext(`(${tagLiteral})`, {}, { timeout: 1000 });
    } catch (e) {
      report('error', I18N_FILE, lineOf(src, 'const TAG_TRANSLATIONS'), `TAG_TRANSLATIONS could not be evaluated: ${e.message}`);
    }
  }
}

function checkTranslations(dictionaries, src) {
  const missingLocale = LOCALES.filter((locale) => !dictionaries[locale]);
  for (const locale of missingLocale) {
    report('error', I18N_FILE, undefined, `TRANSLATIONS has no "${locale}" block, but it's in SUPPORTED_LANGUAGES.`);
  }
  const present = LOCALES.filter((locale) => dictionaries[locale]);
  if (!present.length) return;

  const reference = present.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : present[0];
  const referenceKeys = Object.keys(dictionaries[reference]);

  for (const locale of present) {
    const dict = dictionaries[locale];
    for (const [key, value] of Object.entries(dict)) {
      if (typeof value !== 'string' || !value.trim()) {
        report('error', I18N_FILE, lineOf(src, `'${key}'`), `${locale}."${key}" must be a non-empty string.`);
      }
    }
    if (locale === reference) continue;

    for (const key of referenceKeys) {
      if (!(key in dict)) {
        report('error', I18N_FILE, lineOf(src, `'${key}'`), `"${key}" is missing from the "${locale}" translations (it exists in "${reference}").`);
      } else if (placeholdersIn(dict[key]) !== placeholdersIn(dictionaries[reference][key])) {
        report('error', I18N_FILE, lineOf(src, `'${key}'`), `${locale}."${key}" doesn't use the same {placeholders} as ${reference}.`);
      }
    }
    for (const key of Object.keys(dict)) {
      if (!(key in dictionaries[reference])) {
        report('error', I18N_FILE, lineOf(src, `'${key}'`), `"${key}" only exists in "${locale}" - add it to "${reference}" too, or remove it.`);
      }
    }
  }
}

// ---- 3. script.js: syntax + PROJECTS data ----------------------------------------
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

  // Keys reached through I18N.t('...') rather than a data-i18n attribute.
  for (const m of src.matchAll(/\bt\(\s*'([^']+)'/g)) {
    const key = m[1];
    if (!i18nUsage.has(key)) i18nUsage.set(key, { file: SCRIPT, line: lineAt(src, m.index) });
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

  const usedTags = new Set();

  for (const [category, list] of Object.entries(projects)) {
    // project.html labels a project with its category, via I18N.t('cat.<category>').
    const categoryKey = `cat.${category}`;
    if (!i18nUsage.has(categoryKey)) i18nUsage.set(categoryKey, { file: SCRIPT, line: lineOf(src, `${category}:`) });

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
      else p.tags.forEach((tag) => usedTags.add(tag));

      // Translated title/description, if any - see i18n.js for the UI copy.
      if (p.i18n !== undefined) {
        if (!p.i18n || typeof p.i18n !== 'object' || Array.isArray(p.i18n)) {
          err('"i18n" must be an object keyed by language code, e.g. { pt: { title: ... } }.');
        } else {
          for (const [locale, fields] of Object.entries(p.i18n)) {
            if (LOCALES.length && !LOCALES.includes(locale)) {
              err(`i18n has a "${locale}" block, which isn't in SUPPORTED_LANGUAGES (${LOCALES.join(', ')}).`);
              continue;
            }
            if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
              err(`i18n.${locale} must be an object of translated fields.`);
              continue;
            }
            for (const [field, value] of Object.entries(fields)) {
              if (!TRANSLATABLE_PROJECT_KEYS.has(field)) {
                warn(`i18n.${locale}.${field} isn't translatable (only ${[...TRANSLATABLE_PROJECT_KEYS].join('/')}) - it will be ignored.`);
              } else if (typeof value !== 'string' || !value.trim()) {
                err(`i18n.${locale}.${field} must be a non-empty string.`);
              }
            }
            if (typeof fields.description === 'string' && PLACEHOLDER_TEXT.test(fields.description)) {
              warn(`i18n.${locale} description is still placeholder text - visitors reading ${locale} will see it.`);
            }
          }
        }
      }
      // English prose with no translation falls back to English on screen.
      for (const locale of LOCALES) {
        if (locale === DEFAULT_LOCALE || !p.description) continue;
        if (!p.i18n || !p.i18n[locale] || !p.i18n[locale].description) {
          warn(`has no "${locale}" description, so it stays in ${DEFAULT_LOCALE} when the site is read in ${locale}.`);
        }
      }

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
      // Extra shots on the detail page: shown as small tiles (thumb) that
      // zoom to the full-size file, so both sizes have to be there.
      if (p.images !== undefined) {
        if (!Array.isArray(p.images)) {
          err('"images" must be an array of image paths.');
        } else {
          p.images.forEach((src, n) => {
            if (typeof src !== 'string' || !src.trim()) return err(`images[${n}] must be a path.`);
            const img = resolveLocal(src, SCRIPT);
            const thumb = img.replace(/\/([^/]+)$/, '/thumbs/$1');
            referenced.add(img);
            referenced.add(thumb);
            if (!files.has(img)) err(`images[${n}] "${src}" doesn't exist.`);
            if (!files.has(thumb)) err(`images[${n}] is missing thumbnail "${thumb}" (same filename, inside a thumbs/ folder).`);
            if (!/\.(webp|svg)$/i.test(img)) warn(`images[${n}] "${src}" isn't WebP - convert it to keep pages light.`);
            return undefined;
          });
        }
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

  // A tag translation whose English side no longer exists never applies.
  for (const [locale, dict] of Object.entries(TAG_TRANSLATIONS || {})) {
    for (const tag of Object.keys(dict)) {
      if (!usedTags.has(tag)) {
        report('warning', I18N_FILE, undefined, `TAG_TRANSLATIONS.${locale} translates "${tag}", but no project uses that tag (renamed or removed?).`);
      }
    }
  }
}

// ---- 4. Used keys vs defined keys ----------------------------------------------
// Section 2 checked the languages agree with each other; this checks they
// agree with the pages. A key used but never defined renders as raw
// "some.key" on screen, so it's an error; the reverse is just dead weight.
if (TRANSLATIONS) {
  const locales = LOCALES.filter((locale) => TRANSLATIONS[locale]);
  const reference = locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0];

  if (reference) {
    const defined = new Set(Object.keys(TRANSLATIONS[reference]));

    // Some keys are chosen at runtime (a stored "back to ..." label, a
    // category name), so they're written as plain strings rather than
    // t('...') calls. Anything that exactly matches a key counts as used.
    if (files.has(SCRIPT)) {
      const src = read(SCRIPT);
      for (const m of src.matchAll(/'([^'\n]+)'/g)) {
        if (defined.has(m[1]) && !i18nUsage.has(m[1])) i18nUsage.set(m[1], { file: SCRIPT, line: lineAt(src, m.index) });
      }
    }

    for (const [key, where] of i18nUsage) {
      if (!defined.has(key)) {
        report('error', where.file, where.line, `Translation key "${key}" is used here but isn't defined in i18n.js.`);
      }
    }
    for (const key of defined) {
      if (!i18nUsage.has(key)) {
        report('warning', I18N_FILE, lineOf(read(I18N_FILE), `'${key}'`), `"${key}" is translated but nothing uses it - wire it up with data-i18n, or delete it.`);
      }
    }
  }
}

// ---- 5. Asset weight + orphans ------------------------------------------------
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
