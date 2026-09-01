import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 4173,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
  input: {
    root: fileURLToPath(new URL('./index.html', import.meta.url)),
    en: fileURLToPath(new URL('./en/index.html', import.meta.url)),
    uk: fileURLToPath(new URL('./uk/index.html', import.meta.url)),
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    modulePreload: { polyfill: false },
    sourcemap: false,
  },
  worker: {
    format: 'es',
  },
});
