interface ChapterEditorProps {
  chapterTitle: string;
  initialContent: string;
}

export function ChapterEditor({
  chapterTitle,
  initialContent,
}: ChapterEditorProps) {
  return (
    <section aria-label="Chapter editor">
      <header>
        <h1>{chapterTitle}</h1>
        <button type="button">Save</button>
      </header>

      <div
        data-testid="chapter-editor-area"
        data-editor-shell="lexical"
      >
        <p>Draft editor</p>
        <div role="textbox" aria-label="Chapter draft">
          {initialContent}
        </div>
      </div>
    </section>
  );
}
