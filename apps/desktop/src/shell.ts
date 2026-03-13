import path from 'node:path';

const { dirname } = path;

import type { BrowserWindowConstructorOptions } from 'electron';

const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 900;
const WINDOW_MIN_WIDTH = 960;
const WINDOW_MIN_HEIGHT = 640;
const WINDOW_BACKGROUND = '#111827';

export function createDesktopWindowOptions(preloadPath: string): BrowserWindowConstructorOptions {
  return {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    show: false,
    backgroundColor: WINDOW_BACKGROUND,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  };
}

export function resolveDesktopIndexPath(mainModulePath: string): string {
  return path.resolve(dirname(mainModulePath), '../../../../index.html');
}

export function resolveDesktopPreloadPath(mainModulePath: string): string {
  return path.resolve(dirname(mainModulePath), '../preload.js');
}
