import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HEALTH_ROUTE,
  PROJECTS_ROUTE,
  createHealthResponse,
  createProjectListResponse,
} from '../src/index.js';

test('exports minimal route constants', () => {
  assert.equal(HEALTH_ROUTE, '/health');
  assert.equal(PROJECTS_ROUTE, '/projects');
});

test('builds a health payload', () => {
  assert.deepEqual(createHealthResponse(), { status: 'ok' });
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
