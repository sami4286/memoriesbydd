/* ============================================================================
   BUILD — assembles _src/*.html into _deploy/ with clean directory URLs.

   Replaces the missing scripts/generate-gallery.mjs that package.json and
   netlify.toml both referenced. Without this the Netlify build failed outright.

   Two jobs, deliberately kept separate:
     1. Shell assembly   — _src/<page>.html + partials -> _deploy/<page>/index.html
     2. Catalogue        — _catalogue/designs.json -> _deploy/designs/**  (phase 2)

   URL SHAPE — clean directory URLs (/order/, not /order.html).
   The nav and footer have always pointed at /order, /gallery, /contact and the
   rest; the old build only ever emitted flat .html files, so those links 404'd.
   Directory URLs make the existing markup correct rather than rewriting it.

   CONSEQUENCE: a page at /order/index.html resolves relative asset paths
   against /order/, so `img/logo.png` would 404. Every asset reference is
   rewritten root-relative below. Do not reintroduce relative asset paths in
   _src — they work at the root and nowhere else.
   ============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { buildGallery } from './gallery.mjs';

const root    = path.resolve(import.meta.dirname, '..');
const src     = path.join(root, '_src');
const deploy  = path.join(root, '_deploy');
const partials = path.join(src, 'partials');

const read = file => fs.readFileSync(file, 'utf8');

/* Partials are injected at <!--#name--> markers. */
const partial = name => read(path.join(partials, `${name}.html`));

/* Assets live at the site root. Rewrite every relative reference so a page
   served from /order/ resolves them identically to one served from /. */
const rootRelative = html => html
  .replace(/(\s(?:src|href))="(?!\/|https?:|mailto:|tel:|#|data:)((?:img|css|js|video)\/)/g, '$1="/$2')
  .replace(/(\ssrcset)="([^"]+)"/g, (match, attribute, value) => {
    const fixed = value.split(',')
      .map(candidate => candidate.trim().replace(/^(?!\/|https?:|data:)((?:img|css|js|video)\/)/, '/$1'))
      .join(', ');
    return `${attribute}="${fixed}"`;
  });

/* Motion is injected here rather than authored into each page, so that all
   55-odd pages carry an identical, correctly ordered set and no page can
   quietly drift out of step.

   The head snippet sets html.has-motion BEFORE first paint, which is what the
   CSS keys its "start hidden" rules off. It also removes the class again after
   2.6s if motion.js has not reported in, so a blocked or failed vendor request
   degrades to the plain static page instead of an invisible one.

   defer preserves execution order: gsap, then its plugins, then motion.js. */
const MOTION_HEAD = `<script>(function(d){var r=d.documentElement;`
  + `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){`
  + `r.classList.add('has-motion');`
  + `setTimeout(function(){if(!r.classList.contains('motion-ready'))`
  + `r.classList.remove('has-motion')},2600)}})(document)</script>`;

const MOTION_SCRIPTS = [
  '/js/vendor/gsap.min.js',
  '/js/vendor/ScrollTrigger.min.js',
  '/js/vendor/SplitText.min.js',
  '/js/motion.js'
].map(src => `<script src="${src}" defer></script>`).join('');

const withMotion = html => html
  .replace('</head>', `${MOTION_HEAD}</head>`)
  .replace('</body>', `${MOTION_SCRIPTS}</body>`);

/* index.html stays at the root; every other page becomes <name>/index.html. */
const outputFor = name => name === 'index'
  ? path.join(deploy, 'index.html')
  : path.join(deploy, ...name.split('/'), 'index.html');

/* One finisher for every page the site emits, hand-authored or generated, so
   the catalogue cannot drift out of step with the rest of the site. */
const finish = html => withMotion(rootRelative(
  html
    .replace(/<!--#nav-->/g, partial('nav'))
    .replace(/<!--#footer-->/g, partial('footer'))
));

/* _src is walked recursively so a page can nest: _src/hymns-and-resources/
   hymns.html becomes /hymns-and-resources/hymns/. partials/ is the shell
   fragments, not pages. */
function pagesIn(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory()) {
      return entry.name === 'partials' ? [] : pagesIn(path.join(dir, entry.name), `${prefix}${entry.name}/`);
    }
    return entry.name.endsWith('.html') ? [prefix + entry.name] : [];
  });
}

const pages = pagesIn(src);
const built = [];

for (const file of pages) {
  const name = file.slice(0, -'.html'.length);
  const html = finish(read(path.join(src, file)));

  const target = outputFor(name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  built.push(path.relative(deploy, target).split(path.sep).join("/"));
}

/* The flat .html files the old build emitted are superseded by the directory
   URLs above. Remove them so two URLs never serve the same page — netlify.toml
   301s the old paths across. */
for (const file of pages) {
  const name = file.slice(0, -'.html'.length);
  if (name === 'index' || name.includes('/')) continue;
  const stale = path.join(deploy, `${name}.html`);
  if (fs.existsSync(stale)) fs.rmSync(stale);
}

const catalogue = buildGallery({ root, deploy, finish });

console.log(`build: ${built.length} pages`);
console.log(`  gallery: ${catalogue.pages} pages from ${catalogue.images} images`);
for (const page of built) console.log(`  /${page.replace(/index\.html$/, '')}`);
