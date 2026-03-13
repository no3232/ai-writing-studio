import { createHostConnectionConfig } from '@ai-writing-studio/contracts';

import { createHostConnectionStore } from './host-connection.js';
import {
  createBrowseClient,
  createBrowseController,
  mountBrowseUi,
  type BrowseClient,
  type BrowseController,
} from './browse-ui.js';

export interface BootstrapBrowseRendererOptions {
  document?: Document;
  backendUrl?: string;
  token?: string;
  createBrowseClient?: typeof createBrowseClient;
  createBrowseController?: (options: { client: BrowseClient }) => BrowseController;
  mountBrowseUi?: typeof mountBrowseUi;
}

export function bootstrapBrowseRenderer(options: BootstrapBrowseRendererOptions = {}): void {
  const document = options.document ?? globalThis.document;
  const root = ensureBrowseRoot(document);

  const connectionStore = createHostConnectionStore();
  const config = createHostConnectionConfig({
    backendUrl: options.backendUrl ?? readConfigValue(document.body.dataset.backendUrl, 'http://localhost:3000'),
    token: options.token ?? readConfigValue(document.body.dataset.token, ''),
  });

  connectionStore.setConfig(config);

  const browseClientFactory = options.createBrowseClient ?? createBrowseClient;
  const browseControllerFactory = options.createBrowseController ?? createBrowseController;
  const mount = options.mountBrowseUi ?? mountBrowseUi;

  const client = browseClientFactory(connectionStore.getState().config ?? config);
  const controller = browseControllerFactory({ client });

  mount({ root, controller });
}

export function ensureBrowseRoot(document: Document): HTMLElement {
  const existingRoot = document.getElementById('app');

  if (existingRoot) {
    return existingRoot;
  }

  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  return root;
}

function readConfigValue(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback;
}

if (typeof document !== 'undefined') {
  bootstrapBrowseRenderer();
}
