interface GraphViewNode {
  id: string;
  label: string;
}

interface GraphViewEdge {
  id: string;
  source: string;
  target: string;
}

interface GraphViewProps {
  graphTitle: string;
  nodes: GraphViewNode[];
  edges: GraphViewEdge[];
}

function formatCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function GraphView({
  graphTitle,
  nodes,
  edges,
}: GraphViewProps) {
  return (
    <section aria-label="Graph view">
      <header>
        <h1>{graphTitle}</h1>
        <button type="button">Save</button>
      </header>

      <div
        data-testid="graph-view-area"
        data-graph-shell="react-flow-ready"
      >
        <p>Graph canvas</p>
        <p>{formatCount(nodes.length, 'node', 'nodes')}</p>
        <p>{formatCount(edges.length, 'edge', 'edges')}</p>
      </div>
    </section>
  );
}
