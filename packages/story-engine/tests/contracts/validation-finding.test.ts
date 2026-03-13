import {
  validationFindingFieldNames,
  validationFindingKinds,
  validationFindingSeverities,
  type ValidationFinding,
} from '../../src/contracts/validation-finding';
import { describe, expect, it } from 'vitest';

describe('validation finding contract', () => {
  it('exports the stable validation finding fields and enums', () => {
    expect(validationFindingFieldNames).toEqual([
      'kind',
      'severity',
      'message',
      'documentIds',
      'evidence',
    ]);
    expect(validationFindingSeverities).toEqual(['info', 'warning', 'error']);
    expect(validationFindingKinds).toEqual([
      'unknown-reference',
      'missing-linked-document',
      'relation-awareness-mismatch',
    ]);
  });

  it('describes the minimum validation finding shape', () => {
    const finding: ValidationFinding = {
      kind: 'unknown-reference',
      severity: 'error',
      message: 'Chapter references a character that is not present in the workspace.',
      documentIds: ['chapter-01', 'character-shadow-heir'],
      evidence: ['[[character-shadow-heir]]'],
    };

    expect(finding.severity).toBe('error');
    expect(finding.documentIds).toContain('chapter-01');
    expect(finding.evidence[0]).toBe('[[character-shadow-heir]]');
  });
});
