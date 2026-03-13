import { fileURLToPath } from 'node:url';

import electron from 'electron';
import type { BrowserWindow } from 'electron';

import {
  createDesktopWindowOptions,
  resolveDesktopPreloadPath,
  resolveDesktopRendererTarget,
} from './shell.js';

const { BrowserWindow: ElectronBrowserWindow, app } = electron;

export interface CreateDesktopWindowOptions {
  mainModulePath?: string;
  devServerUrl?: string;
}

export async function createDesktopWindow(
  browserWindow: typeof ElectronBrowserWindow = ElectronBrowserWindow,
  options: CreateDesktopWindowOptions = {},
): Promise<BrowserWindow> {
  const mainModulePath = options.mainModulePath ?? fileURLToPath(import.meta.url);
  const window = new browserWindow(createDesktopWindowOptions(resolveDesktopPreloadPath(mainModulePath)));
  const rendererTarget = resolveDesktopRendererTarget(mainModulePath, options.devServerUrl);

  window.once('ready-to-show', () => {
    window.show();
  });

  if (rendererTarget.kind === 'url') {
    await window.loadURL(rendererTarget.target);
  } else {
    await window.loadFile(rendererTarget.target);
  }

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

if (app) {
  if (!app.isReady()) {
    void bootstrapDesktopApp();
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
