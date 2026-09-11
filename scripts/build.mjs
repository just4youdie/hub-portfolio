#!/usr/bin/env node
// Copies every publishable file into _site/, skipping whatever matches
// .deployignore. CI validates _site/ and deploys that exact folder, so
// "what passed the checks" and "what went live" are always the same bytes.
//
// Usage: node scripts/build.mjs   (or: npm run build)

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, '_site');

function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') { re += '.*'; i++; }
    else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return re;
}

// gitignore-lite: `name` (no slash) matches a basename at any depth,
// a leading `/` anchors to the root, a trailing `/` means "directory".
function compile(line) {
  const dirOnly = line.endsWith('/');
  let body = dirOnly ? line.slice(0, -1) : line;
  const anchored = body.startsWith('/') || body.includes('/');
  body = body.replace(/^\//, '');
  const regex = new RegExp(`^${anchored ? '' : '(?:.*/)?'}${globToRegex(body)}$`);
  return { regex, dirOnly };
}

const rules = readFileSync(path.join(ROOT, '.deployignore'), 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map(compile);

const ignored = (rel, isDir) => rules.some((r) => (!r.dirOnly || isDir) && r.regex.test(rel));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

let copied = 0;
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    if (ignored(rel, entry.isDirectory())) continue;
    if (entry.isDirectory()) { walk(abs); continue; }
    const dest = path.join(OUT, rel);
    mkdirSync(path.dirname(dest), { recursive: true });
    cpSync(abs, dest);
    copied++;
  }
})(ROOT);

if (!existsSync(path.join(OUT, 'index.html'))) {
  console.error('build: _site/index.html is missing - check .deployignore');
  process.exit(1);
}
console.log(`build: copied ${copied} files into _site/`);
