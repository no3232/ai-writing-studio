interface TimelineViewItem {
  id: string;
  title: string;
  order: number;
}

interface TimelineViewProps {
  timelineTitle: string;
  items: TimelineViewItem[];
}

export function TimelineView({
  timelineTitle,
  items,
}: TimelineViewProps) {
  const orderedItems = [...items].sort((left, right) => left.order - right.order);

  return (
    <section aria-label="Timeline view">
      <header>
        <h1>{timelineTitle}</h1>
      </header>

      <ol aria-label="Timeline items">
        {orderedItems.map((item) => (
          <li key={item.id}>
            <span>{item.order}. </span>
            <span>{item.title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
