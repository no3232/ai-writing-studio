import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import { createDesktopWindowOptions, resolveDesktopIndexPath } from '../src/shell.js';

test('createDesktopWindowOptions keeps a minimal secure bootstrap posture', () => {
  assert.deepEqual(createDesktopWindowOptions('/tmp/preload.js'), {
    width: 1280,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#111827',
    webPreferences: {
      preload: '/tmp/preload.js',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
});

test('resolveDesktopIndexPath points at the existing desktop html entry', () => {
  assert.equal(
    resolveDesktopIndexPath('/repo/apps/desktop/dist/apps/desktop/src/main.js'),
    path.resolve('/repo/apps/desktop/index.html'),
  );
});
