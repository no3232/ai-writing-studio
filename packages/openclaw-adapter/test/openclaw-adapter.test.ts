import test from 'node:test';
import assert from 'node:assert/strict';

import { createStubOpenClawHost } from '../src/index.js';

test('stub host reports disconnected state and empty project list', async () => {
  const host = createStubOpenClawHost();

  assert.equal(await host.getStatus(), 'disconnected');
  assert.deepEqual(await host.listProjects(), []);
});
