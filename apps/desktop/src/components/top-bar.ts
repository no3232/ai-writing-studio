import type { BrowseState } from '../browse-ui.js';
import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';

export function renderTopBar(state?: BrowseState): string {
  const connectionStatus = formatConnectionStatus(state?.status);
  const saveStatus = formatSaveStatus(state?.saveState);

  return renderCard({
    className: 'ui-top-bar',
    contentClassName: 'ui-row',
    content: [
      '<div>',
      '<p class="ui-kicker">Workbench</p>',
      '<strong>Top Bar</strong>',
      '<h1>Remote project browser</h1>',
      '<p class="ui-text-muted">Desktop workbench shell with a minimal shadcn/ui-style baseline.</p>',
      '</div>',
      '<div class="ui-row" style="gap:12px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">',
      renderStatusChip('Connection', connectionStatus),
      renderStatusChip('Save status', saveStatus),
      renderButton({ label: 'Sync status', variant: 'secondary' }),
      renderButton({ label: 'Share', variant: 'ghost' }),
      '</div>',
    ].join(''),
  });
}

function renderStatusChip(label: string, value: string): string {
  return `<div class="ui-column" style="gap:2px;padding:8px 10px;border:1px solid var(--ui-border);border-radius:var(--ui-radius);min-width:108px;"><span class="ui-text-muted">${label}</span><strong>${value}</strong></div>`;
}

function formatConnectionStatus(status?: BrowseState['status']): string {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'loading':
      return 'Connecting';
    case 'failed':
      return 'Offline';
    default:
      return 'Idle';
  }
}

function formatSaveStatus(saveState?: BrowseState['saveState']): string {
  switch (saveState) {
    case 'saved':
      return 'Saved';
    case 'saving':
      return 'Saving';
    case 'dirty':
      return 'Dirty';
    case 'failed':
      return 'Failed';
    default:
      return 'Idle';
  }
}
