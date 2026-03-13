export function renderAiPanel(): string {
  return [
    '<aside data-region="ai-panel" style="display:grid;gap:12px;padding:16px;border-left:1px solid #d7dce5;background:#fcfcfd;align-content:start;">',
    '<div>',
    '<h2 style="margin:0 0 8px;">AI Workspace</h2>',
    '<p style="margin:0;color:#475569;">Reserved for assistant tools, prompts, and future workflow support.</p>',
    '</div>',
    '</aside>',
  ].join('');
}
