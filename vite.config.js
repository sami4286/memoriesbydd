import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';
import { resolve } from 'node:path';

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
        'booklets/index': page('funeral-order-of-service-booklets/index.html'),
        'gallery/index': page('gallery/index.html'),
        'how-it-works/index': page('how-it-works/index.html'),
        'prices/index': page('prices/index.html'),
        'resources/index': page('hymns-and-resources/index.html'),
        'tributes/index': page('tributes/index.html'),
        'partners/index': page('partners/index.html'),
        'contact/index': page('contact/index.html'),
        'privacy-policy/index': page('privacy-policy/index.html')
      }
    }
  }
});
