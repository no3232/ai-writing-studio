interface KnowledgeEditorProps {
  documentTitle: string;
  rawContent: string;
}

export function KnowledgeEditor({
  documentTitle,
  rawContent,
}: KnowledgeEditorProps) {
  return (
    <section aria-label="Knowledge editor">
      <header>
        <h1>{documentTitle}</h1>
        <button type="button">Save</button>
      </header>

      <div
        data-testid="knowledge-raw-content-area"
        data-editor-shell="codemirror"
      >
        <p>Raw Markdown</p>
        <pre>{rawContent}</pre>
      </div>
    </section>
  );
}
