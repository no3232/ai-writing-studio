export function renderEditorPanel(): string {
  return [
    '<main data-region="editor-panel" style="display:grid;gap:16px;padding:16px;align-content:start;">',
    '<div>',
    '<h2 style="margin:0 0 8px;">Document</h2>',
    '<p style="margin:0;color:#475569;">The current editor experience is temporarily mounted below while the workbench layout is introduced.</p>',
    '</div>',
    '<div data-slot="legacy-browse-root"></div>',
    '</main>',
  ].join('');
}
