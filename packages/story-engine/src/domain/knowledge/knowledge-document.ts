import type { KnowledgeDocumentType } from './document-types';

export interface KnowledgeDocument {
  id: string;
  type: KnowledgeDocumentType;
  title: string;
  tags: string[];
  links: string[];
  status: string;
  body: string;
}
