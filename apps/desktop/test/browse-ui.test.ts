import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createBrowseController,
  renderBrowseView,
  type BrowseClient,
} from '../src/browse-ui.js';

function region(html: string, regionName: string): string {
  const match = html.match(new RegExp(`<[^>]+data-region="${regionName}"[\\s\\S]*?<\\/(?:aside|main)>`));
  return match?.[0] ?? '';
}

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
    async createDocument(projectId, request) {
      return {
        projectId,
        document: {
          id: request.id,
          title: request.title,
          kind: request.kind,
          content: request.content,
        },
      };
    },
    async updateDocument(projectId, documentId, request) {
      return {
        projectId,
        document: {
          id: documentId,
          title: request.title,
          kind: request.kind,
          content: request.content,
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
    saveState: 'idle',
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
    draftTitle: 'Outline',
    draftContent: 'project-a:outline:content',
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

test('browse controller creates a new document in the selected project and selects it', async () => {
  const createCalls: Array<{ projectId: string; request: { id: string; title: string; kind: string; content: string } }> = [];
  const controller = createBrowseController({
    client: {
      ...createClient(),
      async createDocument(projectId, request) {
        createCalls.push({ projectId, request });
        return {
          projectId,
          document: {
            id: request.id,
            title: request.title,
            kind: request.kind,
            content: request.content,
          },
        };
      },
    },
  });

  await controller.loadProjects();
  await controller.createDocument();

  assert.deepEqual(createCalls, [
    {
      projectId: 'project-a',
      request: {
        id: 'untitled-document',
        title: 'Untitled document',
        kind: 'markdown',
        content: '',
      },
    },
  ]);
  assert.equal(controller.getState().selectedDocumentId, 'untitled-document');
  assert.deepEqual(controller.getState().documents, [
    { id: 'outline', title: 'Outline', kind: 'markdown' },
    { id: 'untitled-document', title: 'Untitled document', kind: 'markdown' },
  ]);
  assert.deepEqual(controller.getState().documentDetail, {
    id: 'untitled-document',
    title: 'Untitled document',
    kind: 'markdown',
    content: '',
  });
});

test('browse controller marks the draft dirty after the selected document changes', async () => {
  const controller = createBrowseController({ client: createClient() });

  await controller.loadProjects();
  controller.updateDraft({ title: 'Outline Revised' });

  assert.equal(controller.getState().saveState, 'dirty');
});

test('browse controller exposes saving state during save and saved state after a successful save', async () => {
  const updateCalls: Array<{
    projectId: string;
    documentId: string;
    request: { title: string; kind: string; content: string };
  }> = [];
  let resolveSave: ((value: {
    projectId: string;
    document: { id: string; title: string; kind: string; content: string };
  }) => void) | undefined;
  const saveSettled = new Promise<{
    projectId: string;
    document: { id: string; title: string; kind: string; content: string };
  }>((resolve) => {
    resolveSave = resolve;
  });

  const controller = createBrowseController({
    client: {
      ...createClient(),
      updateDocument(projectId, documentId, request) {
        updateCalls.push({ projectId, documentId, request });
        return saveSettled;
      },
    },
  });

  await controller.loadProjects();
  controller.updateDraft({ title: 'Outline Revised', content: 'Updated outline copy.' });

  const savePromise = controller.saveDocument();
  assert.equal(controller.getState().saveState, 'saving');

  resolveSave?.({
    projectId: 'project-a',
    document: {
      id: 'outline',
      title: 'Outline Revised',
      kind: 'markdown',
      content: 'Updated outline copy.',
    },
  });
  await savePromise;

  assert.deepEqual(updateCalls, [
    {
      projectId: 'project-a',
      documentId: 'outline',
      request: {
        title: 'Outline Revised',
        kind: 'markdown',
        content: 'Updated outline copy.',
      },
    },
  ]);
  assert.equal(controller.getState().saveState, 'saved');
  assert.deepEqual(controller.getState().documents, [
    { id: 'outline', title: 'Outline Revised', kind: 'markdown' },
  ]);
  assert.deepEqual(controller.getState().documentDetail, {
    id: 'outline',
    title: 'Outline Revised',
    kind: 'markdown',
    content: 'Updated outline copy.',
  });
});

test('browse controller exposes failed save state when saving the selected document fails', async () => {
  const controller = createBrowseController({
    client: {
      ...createClient(),
      async updateDocument() {
        throw new Error('Save failed');
      },
    },
  });

  await controller.loadProjects();
  controller.updateDraft({ title: 'Outline Revised' });
  await controller.saveDocument();

  assert.equal(controller.getState().status, 'failed');
  assert.equal(controller.getState().saveState, 'failed');
  assert.equal(controller.getState().error, 'Save failed');
});

test('renderBrowseView shows the current save state for the selected document in the editor panel', () => {
  const html = renderBrowseView({
    status: 'ready',
    saveState: 'dirty',
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
    draftTitle: 'Chapter 1',
    draftContent: '# Chapter 1',
  });

  assert.match(region(html, 'editor-panel'), /Save state: dirty/);
});

test('renderBrowseView shows create and save controls alongside editable draft fields in the editor panel', () => {
  const html = renderBrowseView({
    status: 'ready',
    saveState: 'idle',
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
    draftTitle: 'Chapter 1',
    draftContent: '# Chapter 1',
  });

  const navigationHtml = region(html, 'navigation-panel');
  const editorHtml = region(html, 'editor-panel');

  assert.match(navigationHtml, /Project B/);
  assert.match(navigationHtml, /data-project-id="project-b" aria-current="true"/);
  assert.match(editorHtml, /data-action="create-document"/);
  assert.match(editorHtml, /name="document-title"/);
  assert.match(editorHtml, /name="document-content"/);
  assert.match(editorHtml, /data-action="save-document"/);
});

test('renderBrowseView keeps project and document browse controls in the navigation region while moving create into the editor region', () => {
  const html = renderBrowseView({
    status: 'ready',
    saveState: 'idle',
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
    draftTitle: 'Chapter 1',
    draftContent: '# Chapter 1',
  });

  const navigationHtml = region(html, 'navigation-panel');
  const editorHtml = region(html, 'editor-panel');

  assert.match(navigationHtml, /data-project-id="project-b" aria-current="true"/);
  assert.match(navigationHtml, /data-document-id="chapter-1" aria-current="true"/);
  assert.doesNotMatch(navigationHtml, /data-action="create-document"/);
  assert.match(editorHtml, /data-action="create-document"/);
  assert.doesNotMatch(editorHtml, /data-document-id=/);
});
