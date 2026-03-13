import { bootstrapBrowseRenderer } from './renderer.js';
import { mountAppShell } from './app-shell.js';

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('Desktop renderer root #app was not found');
}

const legacyBrowseRoot = mountAppShell(appRoot);

bootstrapBrowseRenderer({
  document: {
    body: document.body,
    getElementById(id: string) {
      return id === 'app' ? legacyBrowseRoot : document.getElementById(id);
    },
    createElement(tagName: string) {
      return document.createElement(tagName);
    },
  } as Document,
});
