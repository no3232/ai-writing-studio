import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HEALTH_ROUTE,
  PROJECTS_ROUTE,
  createHealthResponse,
  createHostConnectionConfig,
  createProjectListResponse,
} from '../src/index.js';

test('exports minimal route constants', () => {
  assert.equal(HEALTH_ROUTE, '/health');
  assert.equal(PROJECTS_ROUTE, '/projects');
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
