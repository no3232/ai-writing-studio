import type { KnowledgeDocument } from '../../../src/domain/knowledge/knowledge-document';
import { knowledgeDocumentTypes } from '../../../src/domain/knowledge/document-types';
import { describe, expect, it } from 'vitest';

describe('knowledge document model', () => {
  it('exports the supported knowledge document types', () => {
    expect(knowledgeDocumentTypes).toEqual([
      'character',
      'event',
      'location',
      'faction',
      'rule',
      'chapter',
    ]);
  });

  it('describes the core knowledge document shape', () => {
    const document: KnowledgeDocument = {
      id: 'character-kira',
      type: 'character',
      title: 'Kira',
      tags: ['protagonist', 'mage'],
      links: ['event-first-duel'],
      status: 'active',
      body: 'Kira studies forbidden magic.',
    };

    expect(document.type).toBe('character');
    expect(document.links).toContain('event-first-duel');
    expect(document.status).toBe('active');
  });
});
