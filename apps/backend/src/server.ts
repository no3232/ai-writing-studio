import { createStubOpenClawHost } from '@ai-writing-studio/openclaw-adapter';

import { buildApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';

const app = buildApp({ hostConnection: createStubOpenClawHost() });

try {
  await app.listen({ port, host });
  app.log.info(`backend listening on http://${host}:${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
