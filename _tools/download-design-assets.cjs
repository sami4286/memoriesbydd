/* One-off catalogue importer. Run with sharp available on NODE_PATH. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const portfolio = readJson(path.join(root, '_archive/raw/avada_portfolio.json'));
const designs = readJson(path.join(root, '_archive/data/designs.json'));
const outputRoot = path.join(root, '_deploy/img/designs');
const manifestPath = path.join(root, '_catalogue/designs.json');

const localCovers = {
  'angel-wings': 'angel-wings.png',
  'arsenal-f-c': 'arsenal.png',
  'barbados': 'barbados.png',
  'black-beauty': 'black-beauty.png',
  'classic-one': 'classic-one.png',
  'domino-effect': 'domino-effect.png',
  'ghana': 'ghana.png',
  'godfather': 'godfather.png',
  'jamaica': 'jamaica.png',
  'trinidad': 'trinidad.png',
  'white-lilies': 'white-lilies.png'
};

const colors = {
  'Caribbean & African': ['#173e2d', '#765a2b', '#702026', '#314b68', '#6d4529'],
  Football: ['#711d23', '#223b61', '#75231f', '#203b53', '#5f1e25'],
  Classic: ['#a9967d', '#5b5149', '#7a6957', '#b5a38d', '#514a43'],
  Standard: ['#66504a', '#84704e', '#2c4552', '#6f596d', '#9b7868']
};

const clean = value => String(value || '')
  .replace(/^\s*[.·-]+\s*/, '')
  .replace(/\s+/g, ' ')
  .replace(/loved ones/gi, "loved one's")
  .replace(/compliment(s|ing)?/gi, match => match.toLowerCase().startsWith('compliment') ? match.replace(/compliment/i, 'complement') : match)
  .trim();
const titleCaseName = value => clean(value).replace(/^VIEW\s+/i, '').replace(/\bF\.C\.?$/i, 'F.C.');
const extractUrls = html => [...html.matchAll(/(?:data-orig-src|data-bg)="(https?:\\?\/\\?\/memoriesbydd\.com\\?\/wp-content\\?\/uploads\\?\/[^\"]+?\.(?:png|jpe?g|webp))"/gi)]
  .map(match => match[1].replaceAll('\\/', '/'))
  .filter(url => !/(?:\/|^)(?:dpd|uber)\.png(?:$|\?)/i.test(url))
  .filter((url, index, list) => list.indexOf(url) === index);
const filePriority = url => {
  const file = decodeURIComponent(new URL(url).pathname.split('/').pop()).toLowerCase();
  if (/package|comp|compilation|header|panel/.test(file)) return 0;
  if (/\.png$/.test(file)) return 1;
  return 2;
};
const safeImage = async (input, output) => {
  let pipeline = sharp(input, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();
  if (meta.hasAlpha) pipeline = pipeline.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 });
  await pipeline
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 92, effort: 5 })
    .toFile(output);
  return sharp(output).metadata();
};
const fetchBuffer = async url => {
  let response = await fetch(url, { headers: { 'user-agent': 'MemoriesByDD catalogue migration/1.0' }, signal: AbortSignal.timeout(45000) });
  if (!response.ok) {
    const fallback = `https://memoriesbydd.com/wp-content/uploads/${new URL(url).pathname.split('/').pop()}`;
    response = await fetch(fallback, { headers: { 'user-agent': 'MemoriesByDD catalogue migration/1.0' }, signal: AbortSignal.timeout(45000) });
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
};

const main = async () => {
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

  const archiveBySlug = new Map(portfolio.map(item => [item.slug, item]));
  const manifest = [];
  for (const [index, design] of designs.entries()) {
  const archived = archiveBySlug.get(design.slug);
  if (!archived) throw new Error(`Missing archived portfolio record for ${design.slug}`);
  const directory = path.join(outputRoot, design.slug);
  fs.mkdirSync(directory, { recursive: true });
  const urls = extractUrls(archived.content.rendered).sort((a, b) => filePriority(a) - filePriority(b));
  const sources = [];
  if (localCovers[design.slug]) sources.push({ local: path.join(root, '_deploy/img', localCovers[design.slug]) });
  for (const url of urls) {
    if (sources.length >= 4) break;
    sources.push({ url });
  }
  if (!sources.length) throw new Error(`No imagery found for ${design.slug}`);

  const images = [];
  for (let imageIndex = 0; imageIndex < sources.length; imageIndex += 1) {
    const output = path.join(directory, `${images.length + 1}.webp`);
    const source = sources[imageIndex];
    try {
      const input = source.local ? fs.readFileSync(source.local) : await fetchBuffer(source.url);
      const meta = await safeImage(input, output);
      images.push({ src: `/img/designs/${design.slug}/${images.length + 1}.webp`, width: meta.width, height: meta.height });
      process.stdout.write(`\r${index + 1}/${designs.length} ${design.slug} image ${imageIndex + 1}/${sources.length}   `);
    } catch (error) {
      console.warn(`\nSkipping unavailable asset for ${design.slug}: ${error.message}`);
    }
  }
  if (!images.length) throw new Error(`No usable imagery found for ${design.slug}`);

  const palette = colors[design.category] || colors.Standard;
  manifest.push({
    slug: design.slug,
    name: titleCaseName(design.name || archived.title.rendered),
    category: design.category,
    description: clean(design.description),
    size: clean(design.size) || 'A5 · 148 × 210 mm',
    photoAllowance: clean(design.photo_allowance) || 'Photography tailored to the chosen page count',
    suitability: clean(design.suitability) || 'Burial, cremation and memorial services',
    turnaround: clean(design.turnaround) || 'First digital proof in 24–48 hours',
    color: palette[index % palette.length],
    images
  });
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nImported ${manifest.length} designs to ${path.relative(root, outputRoot)}.`);
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
