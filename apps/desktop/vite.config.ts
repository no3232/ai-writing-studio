import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

const config = {
  root: rootDir,
  publicDir: false,
  build: {
    outDir: resolve(rootDir, 'dist/apps/desktop'),
    emptyOutDir: false,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
};

export default config;
