import test from 'node:test';
import assert from 'node:assert/strict';

import { createStubOpenClawHost } from '@ai-writing-studio/openclaw-adapter';

import { buildApp } from '../src/app.js';

test('GET /health returns contract payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({ method: 'GET', url: '/health' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: 'ok', service: 'backend' });

  await app.close();
});

test('GET /projects returns project list payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({ method: 'GET', url: '/projects' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    projects: [{ id: 'demo-project', name: 'Demo Novel Workspace' }],
  });

  await app.close();
});

test('GET /projects/:projectId/documents returns a document list payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'GET',
    url: '/projects/demo-project/documents',
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    projectId: 'demo-project',
    documents: [
      { id: 'outline', title: 'Story Outline', kind: 'markdown' },
      { id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' },
    ],
  });

  await app.close();
});

test('GET /projects/:projectId/documents returns 404 for unknown projects', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'GET',
    url: '/projects/missing-project/documents',
  });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.json(), {
    message: 'Project not found',
  });

  await app.close();
});

test('GET /projects/:projectId/documents/:documentId returns a document detail payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'GET',
    url: '/projects/demo-project/documents/outline',
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    projectId: 'demo-project',
    document: {
      id: 'outline',
      title: 'Story Outline',
      kind: 'markdown',
      content: '# Story Outline\n\n- Opening image\n- Inciting incident\n- First reversal',
    },
  });

  await app.close();
});

test('GET /projects/:projectId/documents/:documentId returns 404 for unknown documents', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'GET',
    url: '/projects/demo-project/documents/missing-document',
  });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.json(), {
    message: 'Document not found',
  });

  await app.close();
});
