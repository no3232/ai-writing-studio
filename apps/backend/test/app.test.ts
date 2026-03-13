import test from 'node:test';
import assert from 'node:assert/strict';

import { createStubOpenClawHost } from '@ai-writing-studio/openclaw-adapter';

import { buildApp } from '../src/app.js';

test('GET /health allows the Vite desktop dev origins via CORS', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });

  const localhostResponse = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      origin: 'http://localhost:5173',
    },
  });
  const loopbackResponse = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      origin: 'http://127.0.0.1:5173',
    },
  });

  assert.equal(
    localhostResponse.headers['access-control-allow-origin'],
    'http://localhost:5173',
  );
  assert.equal(
    loopbackResponse.headers['access-control-allow-origin'],
    'http://127.0.0.1:5173',
  );

  await app.close();
});

test('OPTIONS preflight for document updates allows the Vite desktop dev origins via CORS', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'OPTIONS',
    url: '/projects/demo-project/documents/chapter-1',
    headers: {
      origin: 'http://localhost:5173',
      'access-control-request-method': 'PUT',
    },
  });

  assert.equal(response.statusCode, 204);
  assert.equal(
    response.headers['access-control-allow-origin'],
    'http://localhost:5173',
  );
  assert.match(String(response.headers['access-control-allow-methods']), /PUT/);

  await app.close();
});

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

test('POST /projects/:projectId/documents creates a document detail payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'POST',
    url: '/projects/demo-project/documents',
    payload: {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'Fresh pages.',
    },
  });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.json(), {
    projectId: 'demo-project',
    document: {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'Fresh pages.',
    },
  });

  await app.close();
});

test('PUT /projects/:projectId/documents/:documentId updates a document detail payload', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });
  const response = await app.inject({
    method: 'PUT',
    url: '/projects/demo-project/documents/chapter-1',
    payload: {
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    projectId: 'demo-project',
    document: {
      id: 'chapter-1',
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
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

test('write document routes return 404 when the project or document is missing', async () => {
  const app = buildApp({ hostConnection: createStubOpenClawHost() });

  const createResponse = await app.inject({
    method: 'POST',
    url: '/projects/missing-project/documents',
    payload: {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'Fresh pages.',
    },
  });
  const updateResponse = await app.inject({
    method: 'PUT',
    url: '/projects/demo-project/documents/missing-document',
    payload: {
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    },
  });

  assert.equal(createResponse.statusCode, 404);
  assert.deepEqual(createResponse.json(), { message: 'Project not found' });
  assert.equal(updateResponse.statusCode, 404);
  assert.deepEqual(updateResponse.json(), { message: 'Document not found' });

  await app.close();
});
