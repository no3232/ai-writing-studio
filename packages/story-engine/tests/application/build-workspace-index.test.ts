import { fileURLToPath } from 'node:url';
import { buildWorkspaceIndex } from '../../src/application/build-workspace-index';
import { loadWorkspace } from '../../src/infrastructure/fs/load-workspace';
import { describe, expect, it } from 'vitest';

describe('buildWorkspaceIndex', () => {
  it('loads the sample workspace and indexes documents by id and type', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );

    const documents = await loadWorkspace(workspacePath);
    const index = buildWorkspaceIndex(documents);

    expect(documents).toHaveLength(6);
    expect(index.byId.get('chapter-01')?.type).toBe('chapter');
    expect(index.byId.get('rule-magic-oath')?.type).toBe('rule');
    expect(index.byType.get('character')?.map((document) => document.id)).toEqual([
      'character-borin',
      'character-kira',
    ]);
    expect(index.byType.get('chapter')?.map((document) => document.id)).toEqual(['chapter-01']);
  });
});
