import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

const config = {
  root: rootDir,
  publicDir: false,
  build: {
    outDir: resolve(rootDir, 'dist/renderer'),
    emptyOutDir: true,
  },
};

export default config;
