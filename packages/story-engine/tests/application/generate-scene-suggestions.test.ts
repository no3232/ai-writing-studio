import { fileURLToPath } from 'node:url';
import { buildWorkspaceIndex } from '../../src/application/build-workspace-index';
import { generateSceneSuggestions } from '../../src/application/generate-scene-suggestions';
import { loadWorkspace } from '../../src/infrastructure/fs/load-workspace';
import { describe, expect, it } from 'vitest';

describe('generateSceneSuggestions', () => {
  it('returns a deterministic suggestion from chapter text and selected characters', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );
    const documents = await loadWorkspace(workspacePath);
    const workspaceIndex = buildWorkspaceIndex(documents);

    const suggestions = generateSceneSuggestions({
      workspaceIndex,
      selectedCharacterIds: ['character-borin', 'character-kira'],
      chapterText: 'Kira stepped into the dueling circle before dawn.',
    });

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      referencedDocumentIds: ['character-borin', 'character-kira'],
      rationale:
        'Generated deterministically from chapter context and selected characters: Borin Thane, Kira Vale.',
    });
    expect(suggestions[0]?.message).toContain('Borin Thane');
    expect(suggestions[0]?.message).toContain('Kira Vale');
    expect(suggestions[0]?.message).toContain('Kira stepped into the dueling circle before dawn.');
  });

  it('accepts a lexical payload as chapter context', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );
    const documents = await loadWorkspace(workspacePath);
    const workspaceIndex = buildWorkspaceIndex(documents);

    const suggestions = generateSceneSuggestions({
      workspaceIndex,
      selectedCharacterIds: ['character-kira'],
      chapterLexicalPayload: {
        root: {
          children: [
            {
              children: [{ text: 'The oath bells answer her name.' }],
            },
          ],
        },
      },
    });

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.message).toContain('The oath bells answer her name.');
    expect(suggestions[0]?.rationale).toContain('Kira Vale');
  });
});
