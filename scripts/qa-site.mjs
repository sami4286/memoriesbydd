import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

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
const regexEscape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const localTarget = (source, value) => {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || /^(?:[a-z]+:|\/\/)/i.test(clean)) return null;
  let target = clean.startsWith('/') ? join(root, clean.slice(1)) : resolve(dirname(source), clean);
  if (clean.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
  if (!extname(target) && !existsSync(target)) target = join(target, 'index.html');
  return target;
};

const canonicalOwners = new Map();
const shellHeaders = new Map();
const shellFooters = new Map();

for (const file of htmlFiles) {
  const source = readFileSync(file, 'utf8');
  const page = label(file);
  if (!/^<!doctype html>/i.test(source.trimStart())) errors.push(`${page}: missing HTML5 doctype`);
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(source)) errors.push(`${page}: missing document language`);
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(source)) errors.push(`${page}: missing viewport meta`);
  const description = source.match(/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=(["'])(.*?)\1/i)?.[2];
  if (!description || description.length < 40) warnings.push(`${page}: description is missing or unusually short`);
  if ((source.match(/<title\b/gi) || []).length !== 1) errors.push(`${page}: expected exactly one title`);
  if ((source.match(/<h1\b/gi) || []).length !== 1) errors.push(`${page}: expected exactly one h1`);
  if (!/<main\b/i.test(source)) errors.push(`${page}: missing main landmark`);
  if (!/<a\b[^>]*\bclass=["'][^"']*skip-link/i.test(source)) errors.push(`${page}: missing keyboard skip link`);
  const visibleText = source.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  if (/\b(?:0800\s*023\s*6263|07552\s*916\s*060|WhatsApp)\b/i.test(visibleText)) errors.push(`${page}: phone and messaging contact must be represented by an accessible icon, not visible contact text`);
  if (/refinements\.css/i.test(source) && (!/family=Hanken\+Grotesk/i.test(source) || !/family=Newsreader/i.test(source))) {
    errors.push(`${page}: shared CSS fonts are not both requested, which can change wrapping between routes`);
  }
  const sharedCssIndex = source.lastIndexOf('/css/refinements.css');
  const spatialCssIndex = source.lastIndexOf('/css/jesper.css');
  if (sharedCssIndex >= 0 && spatialCssIndex < sharedCssIndex) {
    errors.push(`${page}: visual-system stylesheet must load after shared page styles`);
  }
  if (page === 'prices/index.html' && !/class=["']price-scroll["']/i.test(source)) {
    errors.push(`${page}: price comparison needs its mobile scroll region`);
  }

  for (const match of source.matchAll(/<a\b[^>]*\bclass=["']brand(?:\s[^"']*)?["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const tag = match[0].slice(0, match[0].indexOf('>') + 1);
    if (/\baria-label=/i.test(tag)) errors.push(`${page}: brand link must derive its accessible name from its visible copy`);
    if (!/class=["']brand-mark["'][^>]*aria-hidden=["']true["']/i.test(match[0])) errors.push(`${page}: decorative brand mark must be hidden from the accessible name`);
  }
  for (const match of source.matchAll(/<button\b[^>]*\bdata-nav-toggle\b[^>]*>/gi)) {
    if (!/\baria-expanded=["']false["']/i.test(match[0]) || !/\baria-controls=["'][^"']+["']/i.test(match[0])) {
      errors.push(`${page}: menu control must expose aria-expanded and aria-controls`);
    }
  }
  const sharedHeader = source.match(/<header class="site-header"[\s\S]*?<\/header>/i)?.[0];
  const sharedFooter = source.match(/<footer class="footer"[\s\S]*?<\/footer>/i)?.[0];
  if (sharedHeader) shellHeaders.set(page, sharedHeader);
  if (sharedFooter) shellFooters.set(page, sharedFooter);

  const canonical = source.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)?.[1];
  if (!canonical) warnings.push(`${page}: missing canonical URL`);
  else if (!canonical.startsWith('https://memoriesbydd.com/')) errors.push(`${page}: canonical must use the production HTTPS domain`);
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
    if (/^<a/i.test(tag) && value.includes('#')) {
      const hash = value.slice(value.indexOf('#') + 1);
      const fragmentFile = target || file;
      if (hash && existsSync(fragmentFile) && extname(fragmentFile) === '.html') {
        const fragmentSource = readFileSync(fragmentFile, 'utf8');
        const decoded = decodeURIComponent(hash);
        if (!new RegExp(`\\bid=["']${regexEscape(decoded)}["']`, 'i').test(fragmentSource)) {
          errors.push(`${page}: missing fragment target ${value}`);
        }
      }
    }
    if (/\btarget=["']_blank["']/i.test(tag) && !/\brel=["'][^"']*noopener/i.test(tag)) warnings.push(`${page}: target=_blank link should use rel=noopener`);
  }
}

const distinctHeaders = new Set(shellHeaders.values());
const distinctFooters = new Set(shellFooters.values());
if (distinctHeaders.size > 1) errors.push(`shared navigation differs across pages (${distinctHeaders.size} variants)`);
if (distinctFooters.size > 1) errors.push(`shared footer differs across pages (${distinctFooters.size} variants)`);

const designManifestPath = resolve('_catalogue/designs.json');
if (existsSync(designManifestPath)) {
  const designs = JSON.parse(readFileSync(designManifestPath, 'utf8'));
  if (designs.length !== 40) errors.push(`catalogue must contain all 40 archived designs, found ${designs.length}`);
  for (const design of designs) {
    if (!existsSync(join(root, 'designs', design.slug, 'index.html'))) errors.push(`missing design detail route: ${design.slug}`);
    for (const image of design.images || []) if (!existsSync(join(root, image.src.replace(/^\//, '')))) errors.push(`missing design image: ${image.src}`);
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

const publicSource = files.filter(file => ['.html', '.css', '.js'].includes(extname(file)))
  .map(file => readFileSync(file, 'utf8')).join('\n');
if (/\b(?:AIRTABLE_PAT|AIRTABLE_BASE_ID|AIRTABLE_TABLE_ID|MAKE_WEBHOOK_URL)\b/.test(publicSource)) {
  errors.push('public bundle references a server-side environment variable');
}
if (!/:focus-visible\b/.test(publicSource)) errors.push('shared UI is missing a visible keyboard focus treatment');
if (!/\.footer \.footer-bottom[\s\S]*?font-size:1\.125rem/.test(publicSource)
  || !/\.footer \.footer-bottom span[\s\S]*?color:#aaa79f/.test(publicSource)) {
  errors.push('footer metadata must retain its 18px high-contrast accessibility treatment');
}

const netlifySource = readFileSync(resolve('netlify.toml'), 'utf8');
for (const required of ['Strict-Transport-Security', 'X-Content-Type-Options', 'Cross-Origin-Opener-Policy', 'Content-Security-Policy']) {
  if (!netlifySource.includes(required)) errors.push(`netlify.toml: missing ${required} security header`);
}
if (/script-src[^;\n]*'unsafe-inline'/.test(netlifySource)) errors.push('netlify.toml: executable inline scripts must not be allowed by CSP');
if (!/frame-ancestors 'none'/.test(netlifySource) || !/X-Frame-Options = "DENY"/.test(netlifySource)) {
  errors.push('netlify.toml: pages must reject framing');
}
for (const file of htmlFiles) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    const hash = `sha256-${createHash('sha256').update(match[1]).digest('base64')}`;
    if (!netlifySource.includes(`'${hash}'`)) errors.push(`${label(file)}: JSON-LD hash is missing from the Content Security Policy`);
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`Checked ${htmlFiles.length} HTML, ${cssFiles.length} CSS and ${jsFiles.length} JS files.`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
