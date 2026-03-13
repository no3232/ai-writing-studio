import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';

export function renderTopBar(): string {
  return renderCard({
    className: 'ui-top-bar',
    contentClassName: 'ui-row',
    content: [
      '<div>',
      '<p class="ui-kicker">Workbench</p>',
      '<strong>Top Bar</strong>',
      '<p class="ui-text-muted">Desktop workbench shell with a minimal shadcn/ui-style baseline.</p>',
      '</div>',
      '<div class="ui-row">',
      renderButton({ label: 'Sync status', variant: 'secondary' }),
      renderButton({ label: 'Share', variant: 'ghost' }),
      '</div>',
    ].join(''),
  });
}
