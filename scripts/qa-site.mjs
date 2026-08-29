import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve('_deploy');
const functionsRoot = resolve('netlify/functions');
const errors = [];
const warnings = [];

const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const files = walk(root);
const htmlFiles = files.filter(file => extname(file) === '.html');
const cssFiles = files.filter(file => extname(file) === '.css');
const functionFiles = existsSync(functionsRoot) ? walk(functionsRoot).filter(file => extname(file) === '.mjs') : [];
const jsFiles = [...files.filter(file => extname(file) === '.js'), ...functionFiles];
const label = file => relative(root, file).replaceAll('\\', '/');
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
const localTarget = (source, value) => {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || /^(?:[a-z]+:|\/\/)/i.test(clean)) return null;
  let target = clean.startsWith('/') ? join(root, clean.slice(1)) : resolve(dirname(source), clean);
  if (clean.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
  if (!extname(target) && !existsSync(target)) target = join(target, 'index.html');
  return target;
};

const canonicalOwners = new Map();

for (const file of htmlFiles) {
  const source = readFileSync(file, 'utf8');
  const page = label(file);
  if (!/^<!doctype html>/i.test(source.trimStart())) errors.push(`${page}: missing HTML5 doctype`);
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(source)) errors.push(`${page}: missing document language`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(source)) errors.push(`${page}: missing viewport meta`);
  if (!/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']{40,}["']/i.test(source)) warnings.push(`${page}: description is missing or unusually short`);
  if ((source.match(/<title\b/gi) || []).length !== 1) errors.push(`${page}: expected exactly one title`);
  if ((source.match(/<h1\b/gi) || []).length !== 1) errors.push(`${page}: expected exactly one h1`);

  const canonical = source.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)?.[1];
  if (!canonical) warnings.push(`${page}: missing canonical URL`);
  else if (canonicalOwners.has(canonical)) errors.push(`${page}: canonical duplicates ${canonicalOwners.get(canonical)}`);
  else canonicalOwners.set(canonical, page);

  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
  for (const id of new Set(ids)) if (ids.filter(value => value === id).length > 1) errors.push(`${page}: duplicate id "${id}"`);

  for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = attr(tag, 'src');
    if (!src) errors.push(`${page}: image without src`);
    if (attr(tag, 'alt') === undefined) errors.push(`${page}: ${src || 'image'} is missing alt text`);
    if (!attr(tag, 'width') || !attr(tag, 'height')) warnings.push(`${page}: ${src || 'image'} is missing intrinsic dimensions`);
  }

  for (const match of source.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)) {
    const tag = match[0];
    const value = attr(tag, /^<a/i.test(tag) || /^<link/i.test(tag) ? 'href' : 'src');
    if (value === undefined) continue;
    if (!value.trim()) errors.push(`${page}: empty local URL`);
    const target = localTarget(file, value);
    if (target && !existsSync(target)) errors.push(`${page}: missing local target ${value}`);
    if (/\btarget=["']_blank["']/i.test(tag) && !/\brel=["'][^"']*noopener/i.test(tag)) warnings.push(`${page}: target=_blank link should use rel=noopener`);
  }
}

for (const file of cssFiles) {
  const source = readFileSync(file, 'utf8');
  const page = label(file);
  const opens = (source.match(/{/g) || []).length;
  const closes = (source.match(/}/g) || []).length;
  if (opens !== closes) errors.push(`${page}: unbalanced CSS blocks (${opens} opening, ${closes} closing)`);
  for (const match of source.matchAll(/url\(([^)]+)\)/gi)) {
    const value = match[1].trim().replace(/^["']|["']$/g, '');
    const target = localTarget(file, value);
    if (target && !existsSync(target)) errors.push(`${page}: missing CSS asset ${value}`);
  }
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${label(file)}: ${result.stderr.trim()}`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`Checked ${htmlFiles.length} HTML, ${cssFiles.length} CSS and ${jsFiles.length} JS files.`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
