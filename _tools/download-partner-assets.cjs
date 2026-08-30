const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..', '_deploy', 'img', 'partners');
const partners = {
  altayos: 'https://memoriesbydd.com/wp-content/uploads/2020/07/alto-logo.png',
  wntcg: 'https://memoriesbydd.com/wp-content/uploads/2020/07/white-wntcg.png',
  calos: 'https://memoriesbydd.com/wp-content/uploads/2020/07/carlos.png'
};

(async () => {
  fs.mkdirSync(root, { recursive: true });
  for (const [name, url] of Object.entries(partners)) {
    let response = await fetch(url);
    if (!response.ok) response = await fetch(`https://memoriesbydd.com/wp-content/uploads/${url.split('/').pop()}`);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    await sharp(Buffer.from(await response.arrayBuffer()), { failOn: 'none' }).rotate().resize({ width: 720, height: 420, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 92 }).toFile(path.join(root, `${name}.webp`));
  }
  console.log('Downloaded and optimised three established partner marks.');
})().catch(error => { console.error(error); process.exitCode = 1; });
