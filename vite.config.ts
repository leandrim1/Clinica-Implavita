import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@compartilhado': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Em desenvolvimento o front chama /api e o Vite repassa ao Express.
      '/api': { target: 'http://localhost:3333', changeOrigin: false },
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
  },
});
