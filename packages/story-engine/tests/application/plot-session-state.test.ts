import {
  createPlotSessionState,
  regeneratePlotSessionState,
  selectPlotProposal,
} from '../../src/application/plot-session-state';
import type { PlotProposal } from '../../src/contracts';
import { describe, expect, it } from 'vitest';

describe('plot session state', () => {
  it('creates proposals, selects one, and clears the selection on regenerate', () => {
    const initialProposals: PlotProposal[] = [
      {
        id: 'plot-character-kira-event-first-duel',
        summary: 'Kira collides with the duel.',
        beats: ['Beat 1'],
        referencedDocumentIds: ['character-kira', 'event-first-duel'],
        rationale: 'Initial deterministic proposal.',
      },
    ];
    const regeneratedProposals: PlotProposal[] = [
      {
        id: 'plot-character-borin-event-first-duel',
        summary: 'Borin reframes the duel.',
        beats: ['Beat 2'],
        referencedDocumentIds: ['character-borin', 'event-first-duel'],
        rationale: 'Regenerated deterministic proposal.',
      },
    ];

    const createdState = createPlotSessionState(initialProposals);
    const selectedState = selectPlotProposal(
      createdState,
      'plot-character-kira-event-first-duel',
    );
    const regeneratedState = regeneratePlotSessionState(
      selectedState,
      regeneratedProposals,
    );

    expect(createdState.proposals).toEqual(initialProposals);
    expect(createdState.selectedProposalId).toBeNull();
    expect(selectedState.selectedProposalId).toBe('plot-character-kira-event-first-duel');
    expect(regeneratedState.proposals).toEqual(regeneratedProposals);
    expect(regeneratedState.selectedProposalId).toBeNull();
    expect(regeneratedState.revision).toBe(1);
  });
});
