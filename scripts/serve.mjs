/* Local preview only. Serves _deploy with directory-URL resolution so that
   /order/ behaves here exactly as it will on Netlify. Never deployed. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '../_deploy');
const port = Number(process.argv[2] || 4173);

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};

http.createServer((request, response) => {
  const url = decodeURIComponent(request.url.split('?')[0]);
  let file = path.join(rootDir, url);
  if (!file.startsWith(rootDir)) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end(`404 ${url}`);
    return;
  }
  response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
}).listen(port, () => console.log(`preview: http://localhost:${port}/`));
