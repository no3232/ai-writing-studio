export const knowledgeDocumentTypes = [
  'character',
  'event',
  'location',
  'faction',
  'rule',
  'chapter',
] as const;

export type KnowledgeDocumentType = (typeof knowledgeDocumentTypes)[number];
