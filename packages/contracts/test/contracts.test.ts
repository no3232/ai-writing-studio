import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DOCUMENT_CREATE_ROUTE,
  DOCUMENT_DETAIL_ROUTE,
  DOCUMENTS_ROUTE,
  DOCUMENT_UPDATE_ROUTE,
  HEALTH_ROUTE,
  PROJECTS_ROUTE,
  createDocumentCreateRequest,
  createDocumentCreateResponse,
  createDocumentDetailResponse,
  createDocumentListResponse,
  createDocumentUpdateRequest,
  createDocumentUpdateResponse,
  createHealthResponse,
  createHostConnectionConfig,
  createProjectListResponse,
} from '../src/index.js';

test('exports minimal route constants', () => {
  assert.equal(HEALTH_ROUTE, '/health');
  assert.equal(PROJECTS_ROUTE, '/projects');
  assert.equal(DOCUMENTS_ROUTE, '/projects/:projectId/documents');
  assert.equal(DOCUMENT_CREATE_ROUTE, '/projects/:projectId/documents');
  assert.equal(DOCUMENT_DETAIL_ROUTE, '/projects/:projectId/documents/:documentId');
  assert.equal(DOCUMENT_UPDATE_ROUTE, '/projects/:projectId/documents/:documentId');
});

test('builds a health payload', () => {
  assert.deepEqual(createHealthResponse(), { status: 'ok', service: 'backend' });
});

test('builds a project list payload', () => {
  assert.deepEqual(
    createProjectListResponse([
      { id: 'project-1', name: 'First Project' },
      { id: 'project-2', name: 'Second Project' },
    ]),
    {
      projects: [
        { id: 'project-1', name: 'First Project' },
        { id: 'project-2', name: 'Second Project' },
      ],
    },
  );
});

test('builds a document list payload', () => {
  assert.deepEqual(
    createDocumentListResponse('project-1', [
      { id: 'doc-1', title: 'Outline', kind: 'markdown' },
      { id: 'doc-2', title: 'Chapter 1', kind: 'chapter' },
    ]),
    {
      projectId: 'project-1',
      documents: [
        { id: 'doc-1', title: 'Outline', kind: 'markdown' },
        { id: 'doc-2', title: 'Chapter 1', kind: 'chapter' },
      ],
    },
  );
});

test('builds a document detail payload', () => {
  assert.deepEqual(
    createDocumentDetailResponse({
      projectId: 'project-1',
      document: {
        id: 'doc-1',
        title: 'Outline',
        kind: 'markdown',
        content: '# Outline',
      },
    }),
    {
      projectId: 'project-1',
      document: {
        id: 'doc-1',
        title: 'Outline',
        kind: 'markdown',
        content: '# Outline',
      },
    },
  );
});

test('builds document create request and response payloads', () => {
  assert.deepEqual(
    createDocumentCreateRequest({
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'A new scene opens.',
    }),
    {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'A new scene opens.',
    },
  );

  assert.deepEqual(
    createDocumentCreateResponse({
      projectId: 'project-1',
      document: {
        id: 'chapter-2',
        title: 'Chapter 2',
        kind: 'chapter',
        content: 'A new scene opens.',
      },
    }),
    {
      projectId: 'project-1',
      document: {
        id: 'chapter-2',
        title: 'Chapter 2',
        kind: 'chapter',
        content: 'A new scene opens.',
      },
    },
  );
});

test('builds document update request and response payloads', () => {
  assert.deepEqual(
    createDocumentUpdateRequest({
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    }),
    {
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    },
  );

  assert.deepEqual(
    createDocumentUpdateResponse({
      projectId: 'project-1',
      document: {
        id: 'chapter-1',
        title: 'Chapter 1 Revised',
        kind: 'chapter',
        content: 'Updated copy.',
      },
    }),
    {
      projectId: 'project-1',
      document: {
        id: 'chapter-1',
        title: 'Chapter 1 Revised',
        kind: 'chapter',
        content: 'Updated copy.',
      },
    },
  );
});

test('builds a host connection config payload', () => {
  assert.deepEqual(
    createHostConnectionConfig({
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    }),
    {
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    },
  );
});
