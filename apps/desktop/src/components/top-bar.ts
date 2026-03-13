export function renderTopBar(): string {
  return [
    '<header data-region="top-bar" style="grid-column:1 / -1;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #d7dce5;background:#f8fafc;">',
    '<div>',
    '<strong>Top Bar</strong>',
    '<div style="font-size:12px;color:#475569;">Desktop workbench shell</div>',
    '</div>',
    '<div style="font-size:12px;color:#64748b;">Chunk 1 skeleton</div>',
    '</header>',
  ].join('');
}
