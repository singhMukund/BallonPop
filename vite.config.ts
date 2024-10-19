import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './src', // The root directory for your project
  base: './',
  publicDir: '../public', // Correctly point to the public folder
  build: {
    outDir: '../dist', // Output folder for production build
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html'), // Entry HTML file
    },
  },
  server: {
    port: 9001,
    host: '::', // Use IPv6 address
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.js'],
  },
});