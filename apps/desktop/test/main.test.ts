import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import { createDesktopWindow } from '../src/main.js';
import {
  createDesktopWindowOptions,
  resolveDesktopIndexPath,
  resolveDesktopRendererTarget,
} from '../src/shell.js';

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

test('resolveDesktopIndexPath points at the built desktop html entry', () => {
  assert.equal(
    resolveDesktopIndexPath('/repo/apps/desktop/dist/apps/desktop/src/main.js'),
    path.resolve('/repo/apps/desktop/dist/apps/desktop/index.html'),
  );
});

test('resolveDesktopRendererTarget returns the dev server url when configured', () => {
  assert.deepEqual(
    resolveDesktopRendererTarget('/repo/apps/desktop/dist/apps/desktop/src/main.js', 'http://127.0.0.1:5173'),
    {
      kind: 'url',
      target: 'http://127.0.0.1:5173',
    },
  );
});

test('resolveDesktopRendererTarget returns the built index path when dev server url is not configured', () => {
  assert.deepEqual(
    resolveDesktopRendererTarget('/repo/apps/desktop/dist/apps/desktop/src/main.js'),
    {
      kind: 'file',
      target: path.resolve('/repo/apps/desktop/dist/apps/desktop/index.html'),
    },
  );
});

test('createDesktopWindow loads dev server URL when desktop renderer dev server is configured', async () => {
  const events = new Map<string, () => void>();
  const calls: Array<{ kind: 'url' | 'file'; target: string }> = [];

  class FakeBrowserWindow {
    constructor(public readonly options: ReturnType<typeof createDesktopWindowOptions>) {}

    once(event: string, handler: () => void): void {
      events.set(event, handler);
    }

    async loadURL(url: string): Promise<void> {
      calls.push({ kind: 'url', target: url });
    }

    async loadFile(filePath: string): Promise<void> {
      calls.push({ kind: 'file', target: filePath });
    }

    show(): void {}
  }

  const window = await createDesktopWindow(FakeBrowserWindow as never, {
    mainModulePath: '/repo/apps/desktop/dist/apps/desktop/src/main.js',
    devServerUrl: 'http://127.0.0.1:5173',
  });

  assert.equal(window.constructor, FakeBrowserWindow);
  assert.deepEqual(calls, [{ kind: 'url', target: 'http://127.0.0.1:5173' }]);
  assert.ok(events.has('ready-to-show'));
});

test('createDesktopWindow loads built index file when dev server is not configured', async () => {
  const calls: Array<{ kind: 'url' | 'file'; target: string }> = [];

  class FakeBrowserWindow {
    once(): void {}

    async loadURL(url: string): Promise<void> {
      calls.push({ kind: 'url', target: url });
    }

    async loadFile(filePath: string): Promise<void> {
      calls.push({ kind: 'file', target: filePath });
    }

    show(): void {}
  }

  await createDesktopWindow(FakeBrowserWindow as never, {
    mainModulePath: '/repo/apps/desktop/dist/apps/desktop/src/main.js',
  });

  assert.deepEqual(calls, [{ kind: 'file', target: path.resolve('/repo/apps/desktop/dist/apps/desktop/index.html') }]);
});
