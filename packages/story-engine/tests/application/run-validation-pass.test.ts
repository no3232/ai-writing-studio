import { fileURLToPath } from 'node:url';
import { buildWorkspaceIndex } from '../../src/application/build-workspace-index';
import { runValidationPass } from '../../src/application/run-validation-pass';
import type { KnowledgeDocument } from '../../src/domain/knowledge';
import { loadWorkspace } from '../../src/infrastructure/fs/load-workspace';
import { describe, expect, it } from 'vitest';

describe('runValidationPass', () => {
  it('returns an error finding when a chapter references an unknown character', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );
    const documents = await loadWorkspace(workspacePath);
    const workspaceIndex = buildWorkspaceIndex(documents);

    const findings = runValidationPass({
      workspaceIndex,
      chapterDocumentId: 'chapter-01',
      chapterText: 'Kira turns toward [[character-shadow-heir]] before the bells stop.',
    });

    expect(findings).toContainEqual({
      kind: 'unknown-reference',
      severity: 'error',
      message: 'Chapter references a document that is not present in the workspace.',
      documentIds: ['chapter-01', 'character-shadow-heir'],
      evidence: ['[[character-shadow-heir]]'],
    });
  });

  it('returns a finding when a workspace document links to a missing document', async () => {
    const workspacePath = fileURLToPath(
      new URL('../../../../fixtures/sample-project', import.meta.url),
    );
    const documents = await loadWorkspace(workspacePath);
    const brokenEvent: KnowledgeDocument = {
      id: 'event-broken-oath',
      type: 'event',
      title: 'Broken Oath Event',
      tags: ['broken'],
      links: ['location-missing'],
      status: 'draft',
      body: 'A deliberately broken event fixture.',
    };
    const workspaceIndex = buildWorkspaceIndex([...documents, brokenEvent]);

    const findings = runValidationPass({
      workspaceIndex,
    });

    expect(findings).toContainEqual({
      kind: 'missing-linked-document',
      severity: 'warning',
      message: 'Workspace document links to a document that is not present in the index.',
      documentIds: ['event-broken-oath', 'location-missing'],
      evidence: ['location-missing'],
    });
  });
});
