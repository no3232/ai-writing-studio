import test from 'node:test';
import assert from 'node:assert/strict';

import { createProjectsClient } from '../src/project-documents.js';

test('projects client lists projects, documents, and a document from the backend', async () => {
  const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
  const client = createProjectsClient({
    backendUrl: 'http://localhost:3000',
    token: 'desktop-token',
    fetch: async (input, init) => {
      const url = String(input);
      fetchCalls.push({ url, init });

      if (url === 'http://localhost:3000/projects') {
        return new Response(
          JSON.stringify({
            projects: [{ id: 'demo-project', name: 'Demo Novel Workspace' }],
          }),
          { status: 200 },
        );
      }

      if (url === 'http://localhost:3000/projects/demo-project/documents') {
        return new Response(
          JSON.stringify({
            projectId: 'demo-project',
            documents: [{ id: 'outline', title: 'Story Outline', kind: 'markdown' }],
          }),
          { status: 200 },
        );
      }

      if (url === 'http://localhost:3000/projects/demo-project/documents/outline') {
        return new Response(
          JSON.stringify({
            projectId: 'demo-project',
            document: {
              id: 'outline',
              title: 'Story Outline',
              kind: 'markdown',
              content: '# Story Outline',
            },
          }),
          { status: 200 },
        );
      }

      return new Response('Not found', { status: 404 });
    },
  });

  assert.deepEqual(await client.listProjects(), {
    projects: [{ id: 'demo-project', name: 'Demo Novel Workspace' }],
  });
  assert.deepEqual(await client.listDocuments('demo-project'), {
    projectId: 'demo-project',
    documents: [{ id: 'outline', title: 'Story Outline', kind: 'markdown' }],
  });
  assert.deepEqual(await client.getDocument('demo-project', 'outline'), {
    projectId: 'demo-project',
    document: {
      id: 'outline',
      title: 'Story Outline',
      kind: 'markdown',
      content: '# Story Outline',
    },
  });

  assert.deepEqual(fetchCalls, [
    {
      url: 'http://localhost:3000/projects',
      init: {
        method: 'GET',
        headers: { 'x-openclaw-token': 'desktop-token' },
      },
    },
    {
      url: 'http://localhost:3000/projects/demo-project/documents',
      init: {
        method: 'GET',
        headers: { 'x-openclaw-token': 'desktop-token' },
      },
    },
    {
      url: 'http://localhost:3000/projects/demo-project/documents/outline',
      init: {
        method: 'GET',
        headers: { 'x-openclaw-token': 'desktop-token' },
      },
    },
  ]);
});

test('projects client creates and updates documents through the backend', async () => {
  const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
  const client = createProjectsClient({
    backendUrl: 'http://localhost:3000',
    token: 'desktop-token',
    fetch: async (input, init) => {
      const url = String(input);
      fetchCalls.push({ url, init });

      if (url === 'http://localhost:3000/projects/demo-project/documents' && init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            projectId: 'demo-project',
            document: {
              id: 'chapter-2',
              title: 'Chapter 2',
              kind: 'chapter',
              content: 'Fresh pages.',
            },
          }),
          { status: 201 },
        );
      }

      if (
        url === 'http://localhost:3000/projects/demo-project/documents/chapter-1'
        && init?.method === 'PUT'
      ) {
        return new Response(
          JSON.stringify({
            projectId: 'demo-project',
            document: {
              id: 'chapter-1',
              title: 'Chapter 1 Revised',
              kind: 'chapter',
              content: 'Updated copy.',
            },
          }),
          { status: 200 },
        );
      }

      return new Response('Not found', { status: 404 });
    },
  });

  assert.deepEqual(
    await client.createDocument('demo-project', {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'Fresh pages.',
    }),
    {
      projectId: 'demo-project',
      document: {
        id: 'chapter-2',
        title: 'Chapter 2',
        kind: 'chapter',
        content: 'Fresh pages.',
      },
    },
  );
  assert.deepEqual(
    await client.updateDocument('demo-project', 'chapter-1', {
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    }),
    {
      projectId: 'demo-project',
      document: {
        id: 'chapter-1',
        title: 'Chapter 1 Revised',
        kind: 'chapter',
        content: 'Updated copy.',
      },
    },
  );

  assert.deepEqual(fetchCalls, [
    {
      url: 'http://localhost:3000/projects/demo-project/documents',
      init: {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-openclaw-token': 'desktop-token',
        },
        body: JSON.stringify({
          id: 'chapter-2',
          title: 'Chapter 2',
          kind: 'chapter',
          content: 'Fresh pages.',
        }),
      },
    },
    {
      url: 'http://localhost:3000/projects/demo-project/documents/chapter-1',
      init: {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'x-openclaw-token': 'desktop-token',
        },
        body: JSON.stringify({
          title: 'Chapter 1 Revised',
          kind: 'chapter',
          content: 'Updated copy.',
        }),
      },
    },
  ]);
});
