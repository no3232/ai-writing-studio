import { readFileSync } from 'node:fs';
import { parseMarkdownDocument } from '../../../src/infrastructure/markdown/parse-markdown-document';
import { describe, expect, it } from 'vitest';

describe('parseMarkdownDocument', () => {
  it('parses a character fixture into a knowledge document and preserves the body', () => {
    const source = readFileSync(
      new URL('../../../../../fixtures/sample-project/characters/kira.md', import.meta.url),
      'utf8',
    );

    const document = parseMarkdownDocument(source);

    expect(document.type).toBe('character');
    expect(document.id).toBe('character-kira');
    expect(document.links).toEqual(['event-first-duel', 'location-northern-castle']);
    expect(document.body).toContain('Kira studies forbidden oath magic');
  });

  it('normalizes scalar links and recognizes rule documents', () => {
    const source = readFileSync(
      new URL('../../../../../fixtures/sample-project/rules/magic-oath.md', import.meta.url),
      'utf8',
    );

    const document = parseMarkdownDocument(source);

    expect(document.type).toBe('rule');
    expect(document.links).toEqual(['event-first-duel']);
    expect(document.body).toContain('Any mage who breaks a sworn oath');
  });
});
