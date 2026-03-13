import {
  plotProposalFieldNames,
  type PlotProposal,
} from '../../src/contracts/plot-proposal';
import { describe, expect, it } from 'vitest';

describe('plot proposal contract', () => {
  it('exports the stable plot proposal fields', () => {
    expect(plotProposalFieldNames).toEqual([
      'id',
      'summary',
      'beats',
      'referencedDocumentIds',
      'rationale',
    ]);
  });

  it('describes the minimum plot proposal shape', () => {
    const proposal: PlotProposal = {
      id: 'plot-proposal-kira-duel',
      summary: 'Kira enters the duel knowing more about the oath than Borin expects.',
      beats: [
        'Kira accepts the duel terms in public.',
        'Borin pushes for a binding truth.',
      ],
      referencedDocumentIds: ['character-kira', 'character-borin', 'event-first-duel'],
      rationale: 'The proposal combines the duel event with the mentor perception mismatch.',
    };

    expect(proposal.beats).toHaveLength(2);
    expect(proposal.referencedDocumentIds).toContain('event-first-duel');
  });
});
