import { renderCard } from './ui/card.js';

export function renderAiPanel(): string {
  return [
    '<aside data-region="ai-panel" class="ui-panel-stack">',
    renderCard({
      title: 'AI Workspace',
      description: 'Placeholder panel reserved for future assistant tools and workflow support.',
      content: [
        '<div class="ui-column" style="gap:12px;">',
        '<p class="ui-text-muted">Placeholder only — no AI actions are wired in this chunk.</p>',
        '<ul class="ui-text-muted" style="margin:0;padding-left:18px;">',
        '<li>Prompt drafts and presets</li>',
        '<li>Context tools and references</li>',
        '<li>Workflow helpers coming later</li>',
        '</ul>',
        '</div>',
      ].join(''),
    }),
    '</aside>',
  ].join('');
}
