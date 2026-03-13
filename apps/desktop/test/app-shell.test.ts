import test from 'node:test';
import assert from 'node:assert/strict';

import { renderAppShell } from '../src/app-shell.js';
import type { BrowseState } from '../src/browse-ui.js';

function region(html: string, regionName: string): string {
  const match = html.match(new RegExp(`<[^>]+data-region="${regionName}"[\\s\\S]*?<\\/(?:aside|main)>`));
  return match?.[0] ?? '';
}

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

  const navigationHtml = region(html, 'navigation-panel');
  const editorHtml = region(html, 'editor-panel');

  assert.match(navigationHtml, /Project B/);
  assert.match(navigationHtml, /data-project-id="project-b" aria-current="true"/);
  assert.match(navigationHtml, /data-document-id="chapter-1" aria-current="true"/);
  assert.doesNotMatch(editorHtml, /data-document-id=/);
  assert.doesNotMatch(navigationHtml, /data-action="create-document"/);
});

test('editor panel renders selected document draft fields and save state', () => {
  const html = renderAppShell({
    status: 'ready',
    saveState: 'dirty',
    projects: [{ id: 'project-b', name: 'Project B' }],
    selectedProjectId: 'project-b',
    documents: [{ id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' }],
    selectedDocumentId: 'chapter-1',
    documentDetail: {
      id: 'chapter-1',
      title: 'Chapter 1',
      kind: 'chapter',
      content: '# Chapter 1',
    },
    draftTitle: 'Chapter 1 Revised',
    draftContent: '# Revised Chapter 1',
  } satisfies BrowseState);

  const editorHtml = region(html, 'editor-panel');

  assert.match(editorHtml, /name="document-title"/);
  assert.match(editorHtml, /value="Chapter 1 Revised"/);
  assert.match(editorHtml, /name="document-content"/);
  assert.match(editorHtml, /# Revised Chapter 1/);
  assert.match(editorHtml, /data-action="save-document"/);
  assert.match(editorHtml, /Save state: dirty/);
  assert.match(editorHtml, /data-action="create-document"/);
});

test('workbench shell shows connection status, save status, and ai placeholder panel', () => {
  const html = renderAppShell({
    status: 'ready',
    saveState: 'saved',
    projects: [{ id: 'project-b', name: 'Project B' }],
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

  const topBarHtml = html.match(/<[^>]+class="[^"]*ui-top-bar[^"]*"[\s\S]*?<\/section>/)?.[0] ?? html;
  const aiPanelHtml = region(html, 'ai-panel');

  assert.match(topBarHtml, /Connection/i);
  assert.match(topBarHtml, /Ready/i);
  assert.match(topBarHtml, /Save status/i);
  assert.match(topBarHtml, /Saved/i);
  assert.match(aiPanelHtml, /AI Workspace/i);
  assert.match(aiPanelHtml, /Placeholder/i);
  assert.doesNotMatch(aiPanelHtml, /Run prompt|Generate|Ask AI/i);
});
