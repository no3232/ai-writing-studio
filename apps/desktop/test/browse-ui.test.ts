import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createBrowseController,
  renderBrowseView,
  type BrowseClient,
} from '../src/browse-ui.js';

function createClient(): BrowseClient {
  return {
    async listProjects() {
      return {
        projects: [
          { id: 'project-a', name: 'Project A' },
          { id: 'project-b', name: 'Project B' },
        ],
      };
    },
    async listDocuments(projectId) {
      if (projectId === 'project-a') {
        return {
          projectId,
          documents: [{ id: 'outline', title: 'Outline', kind: 'markdown' }],
        };
      }

      return {
        projectId,
        documents: [{ id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' }],
      };
    },
    async getDocument(projectId, documentId) {
      return {
        projectId,
        document: {
          id: documentId,
          title: documentId === 'outline' ? 'Outline' : 'Chapter 1',
          kind: documentId === 'outline' ? 'markdown' : 'chapter',
          content: `${projectId}:${documentId}:content`,
        },
      };
    },
  };
}

test('browse controller loads projects and auto-selects the first project and document', async () => {
  const controller = createBrowseController({ client: createClient() });

  await controller.loadProjects();

  assert.deepEqual(controller.getState(), {
    status: 'ready',
    projects: [
      { id: 'project-a', name: 'Project A' },
      { id: 'project-b', name: 'Project B' },
    ],
    selectedProjectId: 'project-a',
    documents: [{ id: 'outline', title: 'Outline', kind: 'markdown' }],
    selectedDocumentId: 'outline',
    documentDetail: {
      id: 'outline',
      title: 'Outline',
      kind: 'markdown',
      content: 'project-a:outline:content',
    },
    error: undefined,
  });
});

test('selecting a different project refreshes document list and document detail', async () => {
  const controller = createBrowseController({ client: createClient() });

  await controller.loadProjects();
  await controller.selectProject('project-b');

  assert.equal(controller.getState().selectedProjectId, 'project-b');
  assert.deepEqual(controller.getState().documents, [
    { id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' },
  ]);
  assert.equal(controller.getState().selectedDocumentId, 'chapter-1');
  assert.deepEqual(controller.getState().documentDetail, {
    id: 'chapter-1',
    title: 'Chapter 1',
    kind: 'chapter',
    content: 'project-b:chapter-1:content',
  });
});

test('renderBrowseView shows selected items and document content', () => {
  const html = renderBrowseView({
    status: 'ready',
    projects: [
      { id: 'project-a', name: 'Project A' },
      { id: 'project-b', name: 'Project B' },
    ],
    selectedProjectId: 'project-b',
    documents: [{ id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' }],
    selectedDocumentId: 'chapter-1',
    documentDetail: {
      id: 'chapter-1',
      title: 'Chapter 1',
      kind: 'chapter',
      content: '# Chapter 1',
    },
  });

  assert.match(html, /<h1>Remote project browser<\/h1>/);
  assert.match(html, /Project B/);
  assert.match(html, /data-project-id="project-b" aria-current="true"/);
  assert.match(html, /Chapter 1/);
  assert.match(html, /<pre># Chapter 1<\/pre>/);
});
