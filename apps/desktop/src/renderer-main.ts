import './styles.css';

import { bootstrapBrowseRenderer } from './renderer.js';
import { mountAppShell } from './app-shell.js';

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('Desktop renderer root #app was not found');
}

const browseRoot = mountAppShell(appRoot);

bootstrapBrowseRenderer({
  document: {
    body: document.body,
    getElementById(id: string) {
      return id === 'app' ? browseRoot : document.getElementById(id);
    },
    createElement(tagName: string) {
      return document.createElement(tagName);
    },
  } as Document,
});
