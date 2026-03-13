import type { KnowledgeDocument, KnowledgeDocumentType } from '../domain/knowledge';

export interface WorkspaceIndex {
  documents: KnowledgeDocument[];
  byId: Map<string, KnowledgeDocument>;
  byType: Map<KnowledgeDocumentType, KnowledgeDocument[]>;
}

export function buildWorkspaceIndex(documents: KnowledgeDocument[]): WorkspaceIndex {
  const byId = new Map<string, KnowledgeDocument>();
  const byType = new Map<KnowledgeDocumentType, KnowledgeDocument[]>();

  for (const document of documents) {
    byId.set(document.id, document);

    const documentsForType = byType.get(document.type) ?? [];
    documentsForType.push(document);
    byType.set(document.type, documentsForType);
  }

  return {
    documents,
    byId,
    byType,
  };
}
