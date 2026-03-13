import type { BrowseState } from '../browse-ui.js';
import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';
import { renderInput } from './ui/input.js';

export function renderEditorPanel(state?: BrowseState): string {
  return [
    '<main data-region="editor-panel" class="ui-panel-stack">',
    renderCard({
      title: 'Document',
      description: 'The current editor experience remains mounted here while navigation shifts into the sidebar.',
      content: [
        '<div class="ui-column">',
        renderInput({ value: state?.draftTitle ?? 'Untitled draft', readonly: true }),
        '<div class="ui-row">',
        '<p class="ui-text-muted">The live browse/editor flow still mounts below this baseline surface.</p>',
        renderButton({ label: state?.saveState ?? 'Saved', variant: 'secondary' }),
        '</div>',
        '</div>',
      ].join(''),
    }),
    renderCard({
      className: 'ui-legacy-root',
      content: `<div data-slot="legacy-browse-root">${state ? renderDocumentDetail(state) : ''}</div>`,
    }),
    '</main>',
  ].join('');
}

function renderDocumentDetail(state: BrowseState): string {
  if (!state.documentDetail) {
    return '<section><h2>Document</h2><p>Select a document to inspect its content.</p></section>';
  }

  return [
    '<section>',
    '<h2>Document</h2>',
    `<p>Kind: ${escapeHtml(state.documentDetail.kind)}</p>`,
    `<p>Save state: ${escapeHtml(state.saveState)}</p>`,
    '<p><label>Title<br><input type="text" name="document-title" style="width:100%;box-sizing:border-box;" value="',
    escapeAttribute(state.draftTitle ?? state.documentDetail.title),
    '"></label></p>',
    '<p><label>Content<br><textarea name="document-content" style="width:100%;min-height:320px;box-sizing:border-box;">',
    escapeHtml(state.draftContent ?? state.documentDetail.content),
    '</textarea></label></p>',
    '<p><button type="button" data-action="save-document">Save</button></p>',
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
