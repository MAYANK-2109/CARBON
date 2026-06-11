import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Bundle size visualizer: run `npm run build -- --mode analyze` to generate stats.html
// Install: npm install rollup-plugin-visualizer -D -w client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let visualizer: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  visualizer = require('rollup-plugin-visualizer').visualizer;
} catch {
  // optional — skip if not installed
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'analyze' && visualizer
      ? [visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true })]
      : []),
  ],
  esbuild: {
    jsx: 'automatic',
  },
}));
