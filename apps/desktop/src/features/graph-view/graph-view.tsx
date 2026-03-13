import ReactFlow, { type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';

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

function toFlowNodes(nodes: GraphViewNode[]): Node[] {
  return nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: index * 180, y: 48 },
  }));
}

function toFlowEdges(edges: GraphViewEdge[]): Edge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  }));
}

export function GraphView({
  graphTitle,
  nodes,
  edges,
}: GraphViewProps) {
  const flowNodes = toFlowNodes(nodes);
  const flowEdges = toFlowEdges(edges);

  return (
    <section aria-label="Graph view">
      <header>
        <h1>{graphTitle}</h1>
      </header>

      <div
        data-testid="graph-view-area"
        aria-label="Graph canvas"
        style={{ height: 320 }}
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </section>
  );
}
