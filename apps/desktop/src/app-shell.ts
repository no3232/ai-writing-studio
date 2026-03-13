import { renderAiPanel } from './components/ai-panel.js';
import { renderEditorPanel } from './components/editor-panel.js';
import { renderNavigationPanel } from './components/navigation-panel.js';
import { renderTopBar } from './components/top-bar.js';

export function renderAppShell(): string {
  return [
    '<div data-region="workbench-shell" style="min-height:100vh;display:grid;grid-template-columns:260px minmax(0,1fr) 320px;grid-template-rows:auto minmax(0,1fr);font-family:Inter, system-ui, sans-serif;background:#ffffff;color:#0f172a;">',
    renderTopBar(),
    renderNavigationPanel(),
    renderEditorPanel(),
    renderAiPanel(),
    '</div>',
  ].join('');
}

export function mountAppShell(root: HTMLElement): HTMLElement {
  root.innerHTML = renderAppShell();

  const legacyBrowseRoot = root.querySelector<HTMLElement>('[data-slot="legacy-browse-root"]');
  if (!legacyBrowseRoot) {
    throw new Error('App shell is missing the legacy browse root');
  }

  return legacyBrowseRoot;
}
