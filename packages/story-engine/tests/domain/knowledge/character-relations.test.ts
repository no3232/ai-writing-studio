import type {
  Awareness,
  Perception,
  Relationship,
} from '../../../src/domain/knowledge/character-relations';
import { perceptionTruthStatuses } from '../../../src/domain/knowledge/character-relations';
import { describe, expect, it } from 'vitest';

describe('character relation model', () => {
  it('supports asymmetric relations, beliefs, and awareness gaps', () => {
    const relationships: Relationship[] = [
      {
        target: 'character-b',
        relation: 'mentor',
        mutual: false,
        notes: 'B does not recognize A as a student.',
      },
    ];
    const perceptions: Perception[] = [
      {
        target: 'character-b',
        belief: 'B recognizes me as a student.',
        truthStatus: 'false',
      },
    ];
    const awareness: Awareness[] = [
      {
        target: 'character-c',
        knowsExistence: false,
      },
    ];

    expect(relationships[0]).toMatchObject({
      target: 'character-b',
      relation: 'mentor',
      mutual: false,
    });
    expect(perceptionTruthStatuses).toEqual(['true', 'false', 'unknown']);
    expect(perceptions[0]?.truthStatus).toBe('false');
    expect(awareness[0]?.knowsExistence).toBe(false);
  });
});
