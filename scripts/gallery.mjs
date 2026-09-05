/* ============================================================================
   GALLERY — generates /gallery/ and the 40 /gallery/<slug>/ pages.

   Data comes from _catalogue/designs.json, carried across from the v2 build.
   IMAGES DO NOT. v2 stored them as /img/designs/<slug>/1..4.webp; this branch
   has a far richer set under the original naming, /img/designs/<slug>-<variant>
   .webp — 364 files against v2's 160, with named variants (cover, spread,
   stack, package, banner, bookmark, emblem, g1..g9) and 600px companions for
   srcset. The image lists in designs.json are therefore IGNORED and rebuilt by
   scanning the directory. Trusting the JSON would have silently dropped two
   thirds of the photography and produced 404s for the rest.

   Copy in that JSON is scraped from the old site and is not clean — see
   tidyDescription and the display helpers below. Each fix is narrow and
   commented; none of them invent facts about a product.
   ============================================================================ */
import fs from 'node:fs';
import path from 'node:path';

/* The word a catalogue would use for each variant, rather than the file's
   own suffix. g1..g9 are all simply details. */
const PLATE_WORDS = {
  cover: 'Cover', spread: 'Inside spread', stack: 'The set', package: 'The full package',
  banner: 'Pull-up banner', bookmark: 'Bookmarker', emblem: 'Emblem', colourway: 'Colourway'
};
const plateWord = variant => PLATE_WORDS[String(variant).replace(/\d+$/, '')] || 'Detail';

const CATEGORY_SLUGS = {
  'Caribbean & African': 'caribbean-african',
  'Classic': 'classic',
  'Football': 'football',
  'Standard': 'standard'
};

/* Which variant should front a design. Ordered by how well each reads as a
   single representative image at card size. */
const VARIANT_ORDER = [
  'cover', 'cover2', 'cover3', 'spread', 'package', 'package2',
  'stack', 'stack2', 'emblem', 'banner', 'banner2',
  'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9',
  'colourway', 'colourway2', 'bookmark'
];

const esc = value => String(value ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* --------------------------------------------------------------------------
   WebP dimensions, read from the file header.

   width/height attributes are what stop the page reflowing as 40 covers land,
   and there is no image library available here. Covers the three container
   forms: lossy (VP8 ), lossless (VP8L) and extended (VP8X).
   -------------------------------------------------------------------------- */
function webpSize(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(32);
    fs.readSync(fd, buf, 0, 32, 0);
    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;

    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width, height };
    }
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/* --------------------------------------------------------------------------
   Transparency, and what to do about the accent colour.

   The tile floats the package art on a block of the design's own colour, which
   only works if the art has an alpha channel. It usually does: "package" is the
   cutout variant (20 of 25 carry alpha) while "cover" is mostly a photograph on
   a grey studio backdrop (28 of 40 opaque). Leading with cover is what made the
   old cards read as white boxes on beige.

   So the tile prefers a transparent image, and where none exists it falls back
   to filling the card photographically instead of floating a rectangle on it.
   -------------------------------------------------------------------------- */
function webpHasAlpha(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return Boolean(buf[20] & 0x10);   /* extended: alpha flag */
    if (chunk === 'VP8L') return true;                      /* lossless always carries alpha */
    return false;                                           /* simple lossy cannot */
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/* Accents run from near-black greens to pale taupes, so the type on top cannot
   be one fixed colour. Relative luminance decides, per WCAG's formula. */
function isLight(hex) {
  const value = String(hex || '').replace('#', '');
  if (value.length !== 6) return false;
  const channel = i => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4) > 0.42;
}

/* Cutout first, and among cutouts the fullest package shot. */
const CUTOUT_ORDER = ['package', 'package2', 'cover', 'cover2', 'stack', 'banner2', 'g1'];
function tileArt(list) {
  const cutouts = list.filter(image => image.alpha);
  const pick = source => source.slice().sort((a, b) => {
    const ai = CUTOUT_ORDER.indexOf(a.variant);
    const bi = CUTOUT_ORDER.indexOf(b.variant);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  })[0];
  return cutouts.length ? pick(cutouts) : list[0];
}

/* --------------------------------------------------------------------------
   Copy tidying. Narrow, and never inventive.
   -------------------------------------------------------------------------- */

/* Several entries begin with another design's name shouted in caps — the
   classic-three record opens "CLASSIC ONE ." and then describes Classic One.
   That is a copy-paste fault carried over from the original site. Strip the
   stray prefix rather than ship a booklet described as a different booklet. */
const tidyDescription = (text, name) => {
  let out = String(text ?? '').trim();
  out = out.replace(/^[A-Z][A-Z\s'&-]{2,}\s*\.\s*/, '');
  if (!out) out = `${name} is one of our memorial booklet designs, personalised around the person it is for.`;
  return out.replace(/\s+/g, ' ').trim();
};

/* "A5 210 x 148mm" -> "A5 · 210 × 148 mm" */
const tidySize = value => String(value ?? 'A5 · 210 × 148 mm')
  .replace(/^A5\s*/i, 'A5 · ')
  .replace(/\s*x\s*/i, ' × ')
  .replace(/\s*mm\s*$/i, ' mm')
  .trim();

/* "12 gallery Photos 1 Individual Photo" -> "12 gallery photos, 1 individual photo" */
const tidyPhotos = value => {
  let out = String(value ?? '').replace(/(\d+)\s*gallery/gi, '$1 gallery');
  out = out.replace(/\s*(\d+)\s*Individual/i, ', $1 individual');
  out = out.replace(/Photos?/gi, m => m.toLowerCase());
  out = out.replace(/\s+/g, ' ').trim();
  return out || 'Photography arranged around the service';
};

/* "Burial , Cremation, Memorial" -> "Burial, cremation, memorial" */
const tidySuitability = value => {
  const parts = String(value ?? '').split(',').map(p => p.trim()).filter(Boolean);
  if (!parts.length) return 'Burial, cremation, memorial';
  return parts.map((p, i) => i === 0 ? p : p.toLowerCase()).join(', ');
};

const tidyTurnaround = value => String(value ?? '')
  .replace(/(\d)-(\d)\s*Day\s*Turnaround/i, '$1–$2 working days')
  .replace(/^First digital proof in/i, 'First proof in')
  .trim() || '4–5 working days';

/* --------------------------------------------------------------------------
   Image discovery
   -------------------------------------------------------------------------- */
function buildImageIndex(deploy, slugs) {
  const dir = path.join(deploy, 'img', 'designs');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const full = files.filter(f => f.endsWith('.webp') && !f.endsWith('-600.webp'));
  const small = new Set(files.filter(f => f.endsWith('-600.webp')));
  const index = new Map(slugs.map(s => [s, []]));

  for (const file of full) {
    const stem = file.slice(0, -5);
    /* Longest slug wins: "arsenal-f-c-cover" must not match a slug "arsenal". */
    let owner = null;
    for (const slug of slugs) {
      if (stem.startsWith(slug + '-') && (!owner || slug.length > owner.length)) owner = slug;
    }
    if (!owner) continue;

    const variant = stem.slice(owner.length + 1);
    const size = webpSize(path.join(dir, file)) || { width: 1200, height: 1200 };
    index.get(owner).push({
      variant,
      src: `/img/designs/${file}`,
      small: small.has(`${stem}-600.webp`) ? `/img/designs/${stem}-600.webp` : null,
      width: size.width,
      height: size.height,
      alpha: webpHasAlpha(path.join(dir, file))
    });
  }

  for (const [, list] of index) {
    list.sort((a, b) => {
      const ai = VARIANT_ORDER.indexOf(a.variant);
      const bi = VARIANT_ORDER.indexOf(b.variant);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.variant.localeCompare(b.variant);
    });
  }
  return index;
}

const srcsetFor = (image, sizes) => image.small
  ? ` srcset="${image.small} 600w, ${image.src} 1200w" sizes="${sizes}"`
  : '';

/* --------------------------------------------------------------------------
   Page shell
   -------------------------------------------------------------------------- */
const head = ({ title, description, canonical, image, extraCss = true, schema }) => `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="https://memoriesbydd.com${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&family=Italianno&display=swap" rel="stylesheet">
<meta property="og:locale" content="en_GB">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="https://memoriesbydd.com${canonical}">${image ? `
<meta property="og:image" content="https://memoriesbydd.com${image}">` : ''}
${schema ? `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` : ''}
<link rel="stylesheet" href="/css/site.css">${extraCss ? `
<link rel="stylesheet" href="/css/gallery.css">` : ''}
</head>
<body>
`;

/* --------------------------------------------------------------------------
   /gallery/ — the archive
   -------------------------------------------------------------------------- */
function galleryIndex(designs, images) {
  const tiles = designs.map((design, i) => {
    const image = images.get(design.slug)[0];
    return `<a class="orbit_tile" href="/gallery/${design.slug}/" data-orbit-tile
   style="--tint:${esc(design.color)}" aria-label="${esc(design.name)} — ${esc(design.category)}">
  <span class="orbit_tile_img"><img src="${image.src}"${srcsetFor(image, '(max-width:640px) 60vw, 280px')}
    alt="${esc(design.name)} funeral order of service booklet cover"
    width="${image.width}" height="${image.height}"
    ${i < 6 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>
  <span class="orbit_tile_cap">${String(i + 1).padStart(2, '0')} <b>${esc(design.name)}</b></span>
</a>`;
  }).join('\n');

  const plates = designs.map((design, i) => {
    const image = tileArt(images.get(design.slug));
    const light = isLight(design.color);
    return `<a href="/gallery/${design.slug}/" class="tile${image.alpha ? '' : ' tile--photo'}"
   data-anim="up" data-category="${esc(CATEGORY_SLUGS[design.category] || 'standard')}"
   style="--tint:${esc(design.color)}"${light ? ' data-light' : ''}>
  <span class="tile_no">${String(i + 1).padStart(2, '0')}</span>
  <span class="tile_art"><img src="${image.src}"${srcsetFor(image, '(max-width:760px) 92vw, (max-width:1180px) 44vw, 24vw')}
    alt="${esc(design.name)} funeral order of service booklet"
    width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></span>
  <span class="tile_m"><h3>${esc(design.name)}</h3><p>${esc(design.category)}</p></span>
  <span class="tile_go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
</a>`;
  }).join('\n');

  const filters = [['all', 'All 40']]
    .concat(Object.entries(CATEGORY_SLUGS).map(([name, slug]) => [slug, name]))
    .map(([slug, label], i) => `<button type="button" class="gfilter${i === 0 ? ' is-on' : ''}"
    data-filter="${slug}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('\n      ');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Funeral Order of Service Booklet Designs',
    url: 'https://memoriesbydd.com/gallery/',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: designs.length,
      itemListElement: designs.map((design, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: design.name,
        url: `https://memoriesbydd.com/gallery/${design.slug}/`
      }))
    }
  };

  return head({
    title: 'The Gallery | 40 Funeral Order of Service Booklet Designs | Memories',
    description: 'All forty of our funeral order of service booklet designs — Caribbean and African heritage, Classic, Football and Standard ranges. Free proof before we print.',
    canonical: '/gallery/',
    image: images.get(designs[0].slug)[0].src,
    schema
  }) + `
<!--#nav-->

<header class="ghero">
  <div class="wrap ghero_top">
    <p class="label label--muted" data-anim="up">The Archive</p>
    <h1 class="h-display" data-anim="lines" style="font-size:clamp(2.6rem,5vw,4.4rem)">
      Forty Ways to Say <span class="sc">Goodbye</span></h1>
    <p class="body measure" data-anim="up" style="--d:160ms">Every design here is reshaped around
    one person. Turn the archive to look through them, or browse the full set below.</p>
  </div>

  <!-- The archive turns as a drum: forty covers on a single large-radius ring.
       Drag, wheel, arrow keys or the buttons. Falls back to a plain horizontal
       scroller with no JS and under prefers-reduced-motion. -->
  <div class="orbit" data-orbit tabindex="0" role="group"
       aria-label="Funeral booklet design archive — use the left and right arrow keys to turn">
    <div class="orbit_view">
      <div class="orbit_stage" data-orbit-stage>
${tiles}
      </div>
    </div>
    <div class="orbit_hud">
      <p class="orbit_count" data-orbit-count>01<small>/${String(designs.length).padStart(2, '0')}</small></p>
      <strong class="orbit_name" data-orbit-name aria-live="polite">${esc(designs[0].name)}</strong>
      <div class="orbit_rail" aria-hidden="true"><i data-orbit-progress></i></div>
      <div class="orbit_ctl">
        <button type="button" data-orbit-prev aria-label="Previous design">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
        </button>
        <span>Drag to turn the archive</span>
        <button type="button" data-orbit-next aria-label="Next design">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </div>
</header>

<section class="section" id="all" data-ambient>
  <div class="wrap">
    <div class="gbrowse_top">
      <div>
        <p class="label label--muted" data-anim="up">Browse</p>
        <h2 class="h1" data-anim="up" style="--d:80ms">The Full <span class="sc">Set</span></h2>
      </div>
      <div class="gfilters" role="group" aria-label="Filter designs by range" data-anim="fade">
      ${filters}
      </div>
    </div>

    <div class="tiles tiles--even" data-gallery-grid>
${plates}
    </div>

    <p class="gempty" data-gallery-empty hidden>No designs in that range.</p>
  </div>
</section>

<!--#footer-->
<script src="/js/gallery.js" defer></script>
</body>
</html>
`;
}

/* --------------------------------------------------------------------------
   /gallery/<slug>/ — one design
   -------------------------------------------------------------------------- */
function designPage(design, index, designs, images) {
  const list = images.get(design.slug);
  const cover = list[0];
  const rest = list.slice(1, 9);
  const previous = designs[(index - 1 + designs.length) % designs.length];
  const next = designs[(index + 1) % designs.length];
  const description = tidyDescription(design.description, design.name);

  const spec = [
    ['Size', tidySize(design.size)],
    ['Photographs', tidyPhotos(design.photoAllowance)],
    ['Suitable for', tidySuitability(design.suitability)],
    ['Turnaround', tidyTurnaround(design.turnaround)]
  ].map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`).join('\n        ');

  const gallery = rest.length
    ? `<section class="section section--tight" id="detail">
  <div class="wrap">
    <p class="label label--muted" data-anim="up">Inside the Booklet</p>
    <div class="plates_seq" data-stagger="90">
${rest.map((image, i) => `      <figure class="plate${i % 3 === 0 ? ' plate--wide' : ''}${image.alpha ? '' : ' plate--photo'}"
        style="--tint:${esc(design.color)}" data-anim="up">
        <span class="plate_art"><img src="${image.src}"${srcsetFor(image, '(max-width:640px) 90vw, 45vw')}
          alt="${esc(design.name)} — ${esc(plateWord(image.variant).toLowerCase())}"
          width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></span>
        <figcaption>Plate ${String(i + 2).padStart(2, '0')} &mdash; ${esc(plateWord(image.variant))}</figcaption>
      </figure>`).join('\n')}
    </div>
  </div>
</section>`
    : '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${design.name} Funeral Order of Service Booklet`,
    description,
    category: design.category,
    image: `https://memoriesbydd.com${cover.src}`,
    brand: { '@type': 'Brand', name: 'Memories Funeral Booklets' },
    url: `https://memoriesbydd.com/gallery/${design.slug}/`
  };

  return head({
    title: `${design.name} | ${design.category} Funeral Booklet Design | Memories`,
    description: description.slice(0, 155),
    canonical: `/gallery/${design.slug}/`,
    image: cover.src,
    schema
  }) + `
<!--#nav-->

<header class="dhero" style="--tint:${esc(design.color)}">
  <div class="wrap dhero_in">
    <div class="dhero_copy">
      <p class="label label--muted" data-anim="up">
        <a href="/gallery/">The Gallery</a> &nbsp;·&nbsp; ${esc(design.category)}</p>
      <h1 class="h1" data-anim="words">${esc(design.name)}</h1>
      <p class="body" data-anim="up" style="--d:140ms">${esc(description)}</p>

      <dl class="dspec" data-anim="up" style="--d:220ms">
        ${spec}
      </dl>

      <div class="dhero_cta" data-anim="up" style="--d:300ms">
        <a href="/order/" class="btn">Start with this design</a>
        <a href="tel:08000236263" class="dlink">Or call 0800 023 6263</a>
      </div>
    </div>

    <div class="dhero_art">
      <span class="rmask" data-anim="scale">
        <img src="${cover.src}"${srcsetFor(cover, '(max-width:900px) 90vw, 44vw')}
          alt="${esc(design.name)} funeral order of service booklet cover"
          width="${cover.width}" height="${cover.height}" fetchpriority="high" decoding="async">
      </span>
    </div>
  </div>
</header>

${gallery}

<section class="section band dnav">
  <div class="wrap dnav_in">
    <a href="/gallery/${previous.slug}/" class="dnav_l" data-anim="up">
      <span>Previous</span><strong>${esc(previous.name)}</strong></a>
    <a href="/gallery/" class="dlink" data-anim="fade">All 40 Designs</a>
    <a href="/gallery/${next.slug}/" class="dnav_r" data-anim="up">
      <span>Next</span><strong>${esc(next.name)}</strong></a>
  </div>
</section>

<!--#footer-->
</body>
</html>
`;
}

/* -------------------------------------------------------------------------- */
export function buildGallery({ root, deploy, finish }) {
  const designs = JSON.parse(fs.readFileSync(path.join(root, '_catalogue/designs.json'), 'utf8'));
  const images = buildImageIndex(deploy, designs.map(d => d.slug));

  const bare = designs.filter(d => !images.get(d.slug)?.length);
  if (bare.length) {
    throw new Error(`No images found for: ${bare.map(d => d.slug).join(', ')}`);
  }

  const write = (file, html) => {
    const target = path.join(deploy, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, finish(html));
  };

  write('gallery/index.html', galleryIndex(designs, images));
  designs.forEach((design, i) => {
    write(`gallery/${design.slug}/index.html`, designPage(design, i, designs, images));
  });

  const total = [...images.values()].reduce((sum, list) => sum + list.length, 0);
  return { pages: designs.length + 1, images: total };
}
