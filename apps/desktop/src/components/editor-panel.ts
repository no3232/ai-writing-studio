import type { BrowseState } from '../browse-ui.js';
import { renderCard } from './ui/card.js';

export function renderEditorPanel(state?: BrowseState): string {
  return [
    '<main data-region="editor-panel" class="ui-panel-stack">',
    renderCard({
      title: 'Document',
      description: 'Edit the selected draft and save changes from the center panel.',
      className: 'ui-legacy-root',
      content: `<div data-slot="legacy-browse-root">${state ? renderDocumentDetail(state) : renderEditorPlaceholder()}</div>`,
    }),
    '</main>',
  ].join('');
}

function renderEditorPlaceholder(): string {
  return [
    '<section class="ui-column" style="gap:12px;">',
    '<p class="ui-text-muted">Select a project to begin editing.</p>',
    '<input data-ui="input" class="ui-input" type="text" placeholder="Untitled document" readonly style="width:100%;box-sizing:border-box;">',
    '</section>',
  ].join('');
}

function renderDocumentDetail(state: BrowseState): string {
  const title = state.draftTitle ?? state.documentDetail?.title ?? '';
  const content = state.draftContent ?? state.documentDetail?.content ?? '';

  return [
    '<section class="ui-column" style="gap:16px;">',
    '<div class="ui-row" style="justify-content:space-between;align-items:center;gap:12px;">',
    '<div>',
    `<p class="ui-text-muted">Save state: ${escapeHtml(state.saveState)}</p>`,
    state.documentDetail ? `<p class="ui-text-muted">Kind: ${escapeHtml(state.documentDetail.kind)}</p>` : '',
    '</div>',
    state.selectedProjectId
      ? '<div class="ui-row" style="gap:8px;"><button data-ui="button" class="ui-button ui-button--secondary" type="button" data-action="create-document">New document</button><button data-ui="button" class="ui-button ui-button--default" type="button" data-action="save-document">Save</button></div>'
      : '',
    '</div>',
    '<label class="ui-column" style="gap:6px;">',
    '<span>Title</span>',
    `<input data-ui="input" class="ui-input" type="text" name="document-title" value="${escapeAttribute(title)}" ${state.documentDetail ? '' : 'placeholder="Untitled document" '}style="width:100%;box-sizing:border-box;">`,
    '</label>',
    '<label class="ui-column" style="gap:6px;">',
    '<span>Content</span>',
    `<textarea name="document-content" style="width:100%;min-height:320px;box-sizing:border-box;">${escapeHtml(content)}</textarea>`,
    '</label>',
    state.documentDetail ? '' : '<p class="ui-text-muted">Create a document to start writing in this project.</p>',
    '</section>',
  ].join('');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
