import { fileURLToPath } from 'node:url';
import { buildWorkspaceIndex } from '../../src/application/build-workspace-index';
import { generatePlotProposals } from '../../src/application/generate-plot-proposals';
import { loadWorkspace } from '../../src/infrastructure/fs/load-workspace';
import { describe, expect, it } from 'vitest';

describe('generatePlotProposals', () => {
  it('returns at least one deterministic proposal for selected documents', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );
    const documents = await loadWorkspace(workspacePath);
    const workspaceIndex = buildWorkspaceIndex(documents);

    const proposals = generatePlotProposals({
      workspaceIndex,
      selectedDocumentIds: ['event-first-duel', 'character-kira'],
    });

    expect(proposals).toHaveLength(1);
    expect(proposals[0]).toMatchObject({
      id: 'plot-character-kira-event-first-duel',
      referencedDocumentIds: ['character-kira', 'event-first-duel'],
      summary: 'Kira Vale collides with The First Duel in a deterministic placeholder plot.',
      rationale:
        'Generated deterministically from the selected knowledge documents: Kira Vale, The First Duel.',
    });
    expect(proposals[0]?.beats).toEqual([
      'Open on Kira Vale under pressure from the selected workspace context.',
      'Escalate the tension around The First Duel using the linked knowledge documents.',
      'Force a choice that keeps the next drafting step grounded in the referenced documents.',
    ]);
  });
});
