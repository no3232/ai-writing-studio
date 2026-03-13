import test from 'node:test';
import assert from 'node:assert/strict';

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { bootstrapBrowseRenderer } from '../src/renderer.js';

test('renderer entrypoint exists for vite to load', () => {
  const rendererEntryUrl = new URL('../src/renderer-main.ts', import.meta.url);

  assert.equal(existsSync(fileURLToPath(rendererEntryUrl)), true);
});

test('bootstrapBrowseRenderer creates a root element and mounts the browse UI', () => {
  const appended: unknown[] = [];
  const root = { id: '', tagName: 'DIV' } as { id: string; tagName: string };
  const body = {
    appendChild(node: unknown) {
      appended.push(node);
    },
  };

  const document = {
    body,
    getElementById(id: string) {
      return id === 'app' ? null : null;
    },
    createElement(tagName: string) {
      assert.equal(tagName, 'div');
      return root;
    },
  } as unknown as Document;

  const client = { kind: 'client' };
  const controller = { kind: 'controller' };

  let receivedMountOptions:
    | {
        root: unknown;
        controller: unknown;
      }
    | undefined;

  bootstrapBrowseRenderer({
    document,
    backendUrl: 'http://localhost:3000',
    token: 'desktop-token',
    createBrowseClient(options) {
      assert.deepEqual(options, {
        backendUrl: 'http://localhost:3000',
        token: 'desktop-token',
      });
      return client as never;
    },
    createBrowseController(options) {
      assert.deepEqual(options, { client });
      return controller as never;
    },
    mountBrowseUi(options) {
      receivedMountOptions = options;
    },
  });

  assert.equal(root.id, 'app');
  assert.deepEqual(appended, [root]);
  assert.deepEqual(receivedMountOptions, {
    root,
    controller,
  });
});
