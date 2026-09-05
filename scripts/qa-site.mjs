import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve('_deploy');
const files = [];
const walk = dir => readdirSync(dir).forEach(name => {
  if (name === 'dist') return;
  /* Third-party, minified, and not ours to lint. The brace counter below is a
     crude balance check that cannot tell a brace in a regex or string literal
     from a real one, so minified bundles always trip it. */
  if (name === 'vendor') return;
  const path = resolve(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (/\.(html|css|js)$/.test(name)) files.push(path);
});
walk(root);

const errors = [];
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const label = relative(root, file);
  if (/\.html$/.test(file)) {
    if (!/<html\b[^>]*lang="en-GB"/i.test(source)) errors.push(`${label}: missing lang=en-GB`);
    if ((source.match(/<h1\b/gi) || []).length !== 1) errors.push(`${label}: expected exactly one h1`);
    if (!/<meta\s+name="description"/i.test(source)) errors.push(`${label}: missing description`);
    if (/href="#"/.test(source)) errors.push(`${label}: placeholder href found`);
    if (/<img\b(?![^>]*\balt=)/i.test(source)) errors.push(`${label}: image without alt`);

    /* Every local asset a page asks for must actually be on disk.

       All eight spotlight images were referenced for months without existing.
       Nothing in the build looked, so nothing complained — the slider would
       have swapped to broken images the moment the script crash was fixed. */
    const assets = new Set();
    for (const match of source.matchAll(/(?:src|href)="(\/(?:img|css|js|video)\/[^"]+)"/g)) {
      assets.add(match[1]);
    }
    for (const match of source.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url.startsWith('/')) assets.add(url);
      }
    }
    for (const asset of assets) {
      if (!existsSync(resolve(root, '.' + asset))) errors.push(`${label}: missing asset ${asset}`);
    }
  }
  if (/\.(css|js)$/.test(file)) {
    const opens = (source.match(/\{/g) || []).length;
    const closes = (source.match(/\}/g) || []).length;
    if (opens !== closes) errors.push(`${label}: unbalanced braces (${opens}/${closes})`);
  }
}

console.log(`Checked ${files.length} HTML/CSS/JS files.`);
if (errors.length) {
  errors.forEach(error => console.error(`ERROR ${error}`));
  process.exit(1);
}
console.log('0 errors.');
