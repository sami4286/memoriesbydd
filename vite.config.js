import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const page = path => resolve(process.cwd(), '_deploy', path);

export default defineConfig({
  root: '_deploy',
  plugins: [sites()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: page('index.html'),
        '404': page('404.html'),
        order: page('order.html'),
        'designs/index': page('designs/index.html'),
        'how-it-works/index': page('how-it-works/index.html'),
        'prices/index': page('prices/index.html'),
        'resources/index': page('hymns-and-resources/index.html'),
        'resources/funeral-arrangements/index': page('hymns-and-resources/funeral-arrangements/index.html'),
        'resources/hymns/index': page('hymns-and-resources/hymns/index.html'),
        'resources/poems-and-readings/index': page('hymns-and-resources/poems-and-readings/index.html'),
        'tributes/index': page('tributes/index.html'),
        'partners/index': page('partners/index.html'),
        'contact/index': page('contact/index.html'),
        'privacy-policy/index': page('privacy-policy/index.html'),
        ...Object.fromEntries(readdirSync(page('designs'), { withFileTypes: true })
          .filter(entry => entry.isDirectory())
          .map(entry => [`designs/${entry.name}/index`, page(`designs/${entry.name}/index.html`)]))
      }
    }
  }
});
