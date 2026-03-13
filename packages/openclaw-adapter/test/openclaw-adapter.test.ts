import test from 'node:test';
import assert from 'node:assert/strict';

import { createStubOpenClawHost } from '../src/index.js';

test('stub host exposes a browseable fake project and documents', async () => {
  const host = createStubOpenClawHost();

  assert.equal(await host.getStatus(), 'disconnected');
  assert.deepEqual(await host.listProjects(), [
    { id: 'demo-project', name: 'Demo Novel Workspace' },
  ]);
  assert.deepEqual(await host.listDocuments('demo-project'), [
    { id: 'outline', title: 'Story Outline', kind: 'markdown' },
    { id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' },
  ]);
  assert.deepEqual(await host.getDocument('demo-project', 'outline'), {
    id: 'outline',
    title: 'Story Outline',
    kind: 'markdown',
    content: '# Story Outline\n\n- Opening image\n- Inciting incident\n- First reversal',
  });
});

test('stub host creates a document in memory', async () => {
  const host = createStubOpenClawHost();

  const created = await host.createDocument('demo-project', {
    id: 'chapter-2',
    title: 'Chapter 2',
    kind: 'chapter',
    content: 'Fresh pages.',
  });

  assert.deepEqual(created, {
    id: 'chapter-2',
    title: 'Chapter 2',
    kind: 'chapter',
    content: 'Fresh pages.',
  });
  assert.deepEqual(await host.getDocument('demo-project', 'chapter-2'), created);
  assert.deepEqual(await host.listDocuments('demo-project'), [
    { id: 'outline', title: 'Story Outline', kind: 'markdown' },
    { id: 'chapter-1', title: 'Chapter 1', kind: 'chapter' },
    { id: 'chapter-2', title: 'Chapter 2', kind: 'chapter' },
  ]);
});

test('stub host updates an existing document in memory', async () => {
  const host = createStubOpenClawHost();

  const updated = await host.updateDocument('demo-project', 'chapter-1', {
    title: 'Chapter 1 Revised',
    kind: 'chapter',
    content: 'Updated copy.',
  });

  assert.deepEqual(updated, {
    id: 'chapter-1',
    title: 'Chapter 1 Revised',
    kind: 'chapter',
    content: 'Updated copy.',
  });
  assert.deepEqual(await host.getDocument('demo-project', 'chapter-1'), updated);
});

test('stub host returns undefined for unknown project or document lookups', async () => {
  const host = createStubOpenClawHost();

  assert.equal(await host.listDocuments('missing-project'), undefined);
  assert.equal(await host.getDocument('demo-project', 'missing-document'), undefined);
  assert.equal(await host.getDocument('missing-project', 'outline'), undefined);
  assert.equal(
    await host.createDocument('missing-project', {
      id: 'chapter-2',
      title: 'Chapter 2',
      kind: 'chapter',
      content: 'Fresh pages.',
    }),
    undefined,
  );
  assert.equal(
    await host.updateDocument('demo-project', 'missing-document', {
      title: 'Chapter 1 Revised',
      kind: 'chapter',
      content: 'Updated copy.',
    }),
    undefined,
  );
});
