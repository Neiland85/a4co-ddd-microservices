import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Salida a una subcarpeta 'webview' para no colisionar con el build de la extensión
    outDir: 'dist/webview',
    rollupOptions: {
      output: {
        // Nombres de archivo predecibles sin hashes
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
