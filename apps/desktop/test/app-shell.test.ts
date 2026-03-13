import test from 'node:test';
import assert from 'node:assert/strict';

import { renderAppShell } from '../src/app-shell.js';
import type { BrowseState } from '../src/browse-ui.js';

test('workbench shell renders top bar, navigation panel, editor panel, and ai panel regions', () => {
  const html = renderAppShell();

  assert.match(html, /Top Bar/i);
  assert.match(html, /Projects/i);
  assert.match(html, /Document/i);
  assert.match(html, /AI Workspace/i);
});

test('workbench shell uses shared card button and input primitives for major panels', () => {
  const html = renderAppShell();

  assert.match(html, /data-ui="card"/i);
  assert.match(html, /data-ui="button"/i);
  assert.match(html, /data-ui="input"/i);
});

test('navigation panel shows projects and documents and reflects selection state', () => {
  const html = renderAppShell({
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
  } satisfies BrowseState);

  assert.match(html, /data-region="navigation-panel"[\s\S]*Project B/);
  assert.match(html, /data-region="navigation-panel"[\s\S]*data-project-id="project-b" aria-current="true"/);
  assert.match(html, /data-region="navigation-panel"[\s\S]*data-document-id="chapter-1" aria-current="true"/);
  assert.doesNotMatch(html, /data-region="editor-panel"[\s\S]*data-document-id=/);
});
