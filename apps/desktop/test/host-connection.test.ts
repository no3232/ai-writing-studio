import test from 'node:test';
import assert from 'node:assert/strict';

import { createHostConnectionConfig } from '@ai-writing-studio/contracts';

import { createHostConnectionStore } from '../src/host-connection.js';

test('host connection store transitions from idle to connected when verification succeeds', async () => {
  const store = createHostConnectionStore({
    verifyConnection: async (config) => ({
      ok: true,
      health: {
        status: 'ok',
        service: 'backend',
      },
      config,
    }),
  });

  store.setConfig(
    createHostConnectionConfig({
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    }),
  );

  assert.deepEqual(store.getState(), {
    status: 'idle',
    config: {
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    },
  });

  const verificationPromise = store.verify();

  assert.equal(store.getState().status, 'verifying');

  const result = await verificationPromise;

  assert.deepEqual(result, {
    ok: true,
    health: {
      status: 'ok',
      service: 'backend',
    },
    config: {
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    },
  });

  assert.deepEqual(store.getState(), {
    status: 'connected',
    config: {
      backendUrl: 'http://localhost:3000',
      token: 'secret-token',
    },
    health: {
      status: 'ok',
      service: 'backend',
    },
  });
});

test('host connection store transitions to failed when verification rejects', async () => {
  const store = createHostConnectionStore({
    verifyConnection: async () => {
      throw new Error('Backend unavailable');
    },
  });

  store.setConfig(
    createHostConnectionConfig({
      backendUrl: 'http://localhost:3000',
      token: '',
    }),
  );

  await assert.rejects(() => store.verify(), /Backend unavailable/);

  assert.deepEqual(store.getState(), {
    status: 'failed',
    config: {
      backendUrl: 'http://localhost:3000',
      token: '',
    },
    error: 'Backend unavailable',
  });
});
