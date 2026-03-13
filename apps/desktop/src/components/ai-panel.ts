import { renderButton } from './ui/button.js';
import { renderCard } from './ui/card.js';

export function renderAiPanel(): string {
  return [
    '<aside data-region="ai-panel" class="ui-panel-stack">',
    renderCard({
      title: 'AI Workspace',
      description: 'Reserved for assistant tools, prompts, and future workflow support.',
      content: [
        '<div class="ui-column">',
        '<p class="ui-text-muted">This area stays intentionally lightweight in Chunk 2.</p>',
        renderButton({ label: 'Prompt presets', variant: 'secondary' }),
        '</div>',
      ].join(''),
    }),
    '</aside>',
  ].join('');
}
