import type { ValidationFinding } from '../contracts';
import type { WorkspaceIndex } from './build-workspace-index';

export interface RunValidationPassInput {
  workspaceIndex: WorkspaceIndex;
  chapterDocumentId?: string;
  chapterText?: string;
}

function findUnknownChapterReferences({
  workspaceIndex,
  chapterDocumentId,
  chapterText,
}: RunValidationPassInput): ValidationFinding[] {
  if (!chapterDocumentId || !chapterText) {
    return [];
  }

  const matches = Array.from(chapterText.matchAll(/\[\[([^[\]]+)\]\]/g));

  return matches
    .map((match) => ({
      reference: match[1],
      evidence: match[0],
    }))
    .filter(({ reference }) => !workspaceIndex.byId.has(reference))
    .map(({ reference, evidence }) => ({
      kind: 'unknown-reference' as const,
      severity: 'error' as const,
      message: 'Chapter references a document that is not present in the workspace.',
      documentIds: [chapterDocumentId, reference],
      evidence: [evidence],
    }));
}

function findMissingLinkedDocuments(workspaceIndex: WorkspaceIndex): ValidationFinding[] {
  return workspaceIndex.documents.flatMap((document) =>
    document.links
      .filter((linkedDocumentId) => !workspaceIndex.byId.has(linkedDocumentId))
      .map((linkedDocumentId) => ({
        kind: 'missing-linked-document' as const,
        severity: 'warning' as const,
        message: 'Workspace document links to a document that is not present in the index.',
        documentIds: [document.id, linkedDocumentId],
        evidence: [linkedDocumentId],
      })),
  );
}

export function runValidationPass(input: RunValidationPassInput): ValidationFinding[] {
  return [
    ...findUnknownChapterReferences(input),
    ...findMissingLinkedDocuments(input.workspaceIndex),
  ];
}
