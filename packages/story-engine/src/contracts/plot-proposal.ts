export const plotProposalFieldNames = [
  'id',
  'summary',
  'beats',
  'referencedDocumentIds',
  'rationale',
] as const;

export interface PlotProposal {
  id: string;
  summary: string;
  beats: string[];
  referencedDocumentIds: string[];
  rationale: string;
}
