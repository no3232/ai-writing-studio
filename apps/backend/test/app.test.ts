import test from 'node:test';
import assert from 'node:assert/strict';

import { createStubOpenClawHost } from '@ai-writing-studio/openclaw-adapter';

import { buildApp } from '../src/app.js';

test('GET /health returns ok payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({ method: 'GET', url: '/health' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: 'ok' });

  await app.close();
});

test('GET /projects returns project list payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({ method: 'GET', url: '/projects' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { projects: [] });

  await app.close();
});

test('GET /projects passes through the injected host connection result', async () => {
  const projects = [
    { id: 'project-1', name: 'Draft One' },
    { id: 'project-2', name: 'Draft Two' },
  ];
  const app = buildApp({
    hostConnection: {
      async getStatus() {
        return 'connected' as const;
      },
      async listProjects() {
        return projects;
      },
    },
  });
  const response = await app.inject({ method: 'GET', url: '/projects' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { projects });

  await app.close();
});
