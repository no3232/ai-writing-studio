import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';
import { renderInput } from './ui/input.js';

export function renderNavigationPanel(): string {
  return [
    '<aside data-region="navigation-panel" class="ui-panel-stack">',
    renderCard({
      title: 'Projects',
      description: 'Navigation content will move here in a later chunk.',
      content: [
        renderInput({ placeholder: 'Search projects', readonly: true }),
        '<div class="ui-column">',
        '<p class="ui-text-muted">Recent workspace groups and document collections will live in this rail.</p>',
        renderButton({ label: 'New project', variant: 'secondary' }),
        '</div>',
      ].join(''),
    }),
    '</aside>',
  ].join('');
}
