import type { BrowseState } from './browse-ui.js';
import { renderAiPanel } from './components/ai-panel.js';
import { renderEditorPanel } from './components/editor-panel.js';
import { renderNavigationPanel } from './components/navigation-panel.js';
import { renderTopBar } from './components/top-bar.js';

export function renderAppShell(state?: BrowseState): string {
  return [
    '<div data-region="workbench-shell" class="ui-workbench">',
    renderTopBar(state),
    renderNavigationPanel(state),
    renderEditorPanel(state),
    renderAiPanel(),
    '</div>',
  ].join('');
}

export function mountAppShell(root: HTMLElement): HTMLElement {
  root.innerHTML = renderAppShell();

  if (!root.querySelector<HTMLElement>('[data-slot="legacy-browse-root"]')) {
    throw new Error('App shell is missing the legacy browse root');
  }

  return root;
}
