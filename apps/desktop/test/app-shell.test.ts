import test from 'node:test';
import assert from 'node:assert/strict';

import { renderAppShell } from '../src/app-shell.js';

test('workbench shell renders top bar, navigation panel, editor panel, and ai panel regions', () => {
  const html = renderAppShell();

  assert.match(html, /Top Bar/i);
  assert.match(html, /Projects/i);
  assert.match(html, /Document/i);
  assert.match(html, /AI Workspace/i);
});
