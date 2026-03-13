import type { PlotProposal } from '../contracts';
import type { WorkspaceIndex } from './build-workspace-index';

export interface GeneratePlotProposalsInput {
  workspaceIndex: WorkspaceIndex;
  selectedDocumentIds: string[];
}

export function generatePlotProposals({
  workspaceIndex,
  selectedDocumentIds,
}: GeneratePlotProposalsInput): PlotProposal[] {
  const selectedDocuments = selectedDocumentIds
    .map((documentId) => workspaceIndex.byId.get(documentId))
    .filter((document): document is NonNullable<typeof document> => document !== undefined)
    .sort((left, right) => left.id.localeCompare(right.id));

  if (selectedDocuments.length === 0) {
    return [];
  }

  const referencedDocumentIds = selectedDocuments.map((document) => document.id);
  const titles = selectedDocuments.map((document) => document.title);
  const [primaryTitle, secondaryTitle = primaryTitle] = titles;

  return [
    {
      id: `plot-${referencedDocumentIds.join('-')}`,
      summary: `${primaryTitle} collides with ${secondaryTitle} in a deterministic placeholder plot.`,
      beats: [
        `Open on ${primaryTitle} under pressure from the selected workspace context.`,
        `Escalate the tension around ${secondaryTitle} using the linked knowledge documents.`,
        'Force a choice that keeps the next drafting step grounded in the referenced documents.',
      ],
      referencedDocumentIds,
      rationale: `Generated deterministically from the selected knowledge documents: ${titles.join(', ')}.`,
    },
  ];
}
