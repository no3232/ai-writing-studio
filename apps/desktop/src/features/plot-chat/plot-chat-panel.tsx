interface PlotChatPanelProps {
  assistantMessage: string;
}

const filters = ['Plot', 'Character', 'Validation'] as const;

export function PlotChatPanel({ assistantMessage }: PlotChatPanelProps) {
  return (
    <section aria-label="Plot chat panel">
      <header>
        <h2>Story Suggestions</h2>
        <div>
          <button type="button">Unified View</button>
          <button type="button">Agent View</button>
        </div>
      </header>

      <div aria-label="Assistant message stream">
        <p>{assistantMessage}</p>
      </div>

      <div aria-label="Suggestion filters">
        {filters.map((filter) => (
          <button key={filter} type="button">
            {filter}
          </button>
        ))}
      </div>

      <label>
        Prompt
        <textarea aria-label="Prompt" placeholder="Ask for the next scene or revision target." />
      </label>
    </section>
  );
}
