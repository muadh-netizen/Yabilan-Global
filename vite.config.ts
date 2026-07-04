import { defineConfig } from 'vite';
import { copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        travel: 'travel.html',
        insurance: 'insurance.html',
        chemicals: 'chemicals.html',
        contact: 'contact.html',
      },
    },
  },
});
