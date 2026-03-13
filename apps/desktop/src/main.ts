import { fileURLToPath } from 'node:url';

import electron from 'electron';
import type { BrowserWindow } from 'electron';

import {
  createDesktopWindowOptions,
  resolveDesktopIndexPath,
  resolveDesktopPreloadPath,
} from './shell.js';

const { BrowserWindow: ElectronBrowserWindow, app } = electron;

export async function createDesktopWindow(browserWindow: typeof ElectronBrowserWindow = ElectronBrowserWindow): Promise<BrowserWindow> {
  const mainModulePath = fileURLToPath(import.meta.url);
  const window = new browserWindow(createDesktopWindowOptions(resolveDesktopPreloadPath(mainModulePath)));

  window.once('ready-to-show', () => {
    window.show();
  });

  await window.loadFile(resolveDesktopIndexPath(mainModulePath));

  return window;
}

async function bootstrapDesktopApp(): Promise<void> {
  await app.whenReady();
  await createDesktopWindow();

  app.on('activate', async () => {
    if (ElectronBrowserWindow.getAllWindows().length === 0) {
      await createDesktopWindow();
    }
  });
}

if (!app.isReady()) {
  void bootstrapDesktopApp();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
