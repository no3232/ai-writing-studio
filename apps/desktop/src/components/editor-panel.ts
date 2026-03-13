import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';
import { renderInput } from './ui/input.js';

export function renderEditorPanel(): string {
  return [
    '<main data-region="editor-panel" class="ui-panel-stack">',
    renderCard({
      title: 'Document',
      description: 'The current editor experience is temporarily mounted below while the workbench layout is introduced.',
      content: [
        '<div class="ui-column">',
        renderInput({ value: 'Untitled draft', readonly: true }),
        '<div class="ui-row">',
        '<p class="ui-text-muted">The live browse/editor flow still mounts below this baseline surface.</p>',
        renderButton({ label: 'Saved', variant: 'secondary' }),
        '</div>',
        '</div>',
      ].join(''),
    }),
    renderCard({
      className: 'ui-legacy-root',
      content: '<div data-slot="legacy-browse-root"></div>',
    }),
    '</main>',
  ].join('');
}
