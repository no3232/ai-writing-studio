import type { BrowseState } from '../browse-ui.js';
import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';

export function renderNavigationPanel(state?: BrowseState): string {
  return [
    '<aside data-region="navigation-panel" class="ui-panel-stack">',
    state ? renderBrowseNavigation(state) : renderNavigationPlaceholder(),
    '</aside>',
  ].join('');
}

function renderNavigationPlaceholder(): string {
  return renderCard({
    title: 'Projects',
    description: 'Navigation content will move here in a later chunk.',
    content: [
      '<div class="ui-column">',
      '<p class="ui-text-muted">Recent workspace groups and document collections will live in this rail.</p>',
      renderButton({ label: 'New project', variant: 'secondary' }),
      '</div>',
    ].join(''),
  });
}

function renderBrowseNavigation(state: BrowseState): string {
  return [renderProjectsCard(state), renderDocumentsCard(state)].join('');
}

function renderProjectsCard(state: BrowseState): string {
  return renderCard({
    title: 'Projects',
    description: 'Browse remote projects.',
    content: [
      '<ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px;">',
      ...state.projects.map((project) =>
        `<li><button type="button" data-project-id="${escapeAttribute(project.id)}" aria-current="${String(
          project.id === state.selectedProjectId,
        )}" style="width:100%;text-align:left;padding:8px;">${escapeHtml(project.name)}</button></li>`,
      ),
      state.projects.length === 0 ? '<li>No projects</li>' : '',
      '</ul>',
    ].join(''),
  });
}

function renderDocumentsCard(state: BrowseState): string {
  return renderCard({
    title: 'Documents',
    description: state.selectedProjectId ? 'Browse documents in the selected project.' : 'Select a project to browse documents.',
    content: [
      state.selectedProjectId
        ? '<p><button data-ui="button" class="ui-button ui-button--default" type="button" data-action="create-document">New document</button></p>'
        : '',
      '<ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px;">',
      ...state.documents.map((document) =>
        `<li><button type="button" data-document-id="${escapeAttribute(document.id)}" aria-current="${String(
          document.id === state.selectedDocumentId,
        )}" style="width:100%;text-align:left;padding:8px;">${escapeHtml(document.title)}</button></li>`,
      ),
      state.documents.length === 0 ? '<li>No documents</li>' : '',
      '</ul>',
    ].join(''),
  });
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
