// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GraphView } from './graph-view';

class ResizeObserverMock {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 320,
            right: 640,
            width: 640,
            height: 320,
            toJSON() {
              return this;
            },
          },
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    );
  }

  unobserve() {}

  disconnect() {}
}

class DOMMatrixReadOnlyMock {
  m11 = 1;

  m22 = 1;

  m41 = 0;

  m42 = 0;
}

function getMockOffsetWidth(this: HTMLElement) {
  return this.getAttribute('data-testid')?.startsWith('rf__node-') ? 120 : 640;
}

function getMockOffsetHeight(this: HTMLElement) {
  return this.getAttribute('data-testid')?.startsWith('rf__node-') ? 48 : 320;
}

function restoreGlobalProperty(
  key: 'ResizeObserver' | 'DOMMatrixReadOnly',
  value: unknown,
) {
  const globalScope = globalThis as Record<string, unknown>;

  if (typeof value === 'undefined') {
    delete globalScope[key];
    return;
  }

  globalScope[key] = value;
}

function restoreDescriptor(
  target: object,
  key: 'offsetWidth' | 'offsetHeight',
  descriptor?: PropertyDescriptor,
) {
  if (!descriptor) {
    delete (target as Record<string, unknown>)[key];
    return;
  }

  Object.defineProperty(target, key, descriptor);
}

function installGraphViewJSDomMocks() {
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalDOMMatrixReadOnly = globalThis.DOMMatrixReadOnly;
  const originalOffsetWidthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  );
  const originalOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  );

  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
  globalThis.DOMMatrixReadOnly = DOMMatrixReadOnlyMock as typeof DOMMatrixReadOnly;
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get: getMockOffsetWidth,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get: getMockOffsetHeight,
  });

  return () => {
    restoreGlobalProperty('ResizeObserver', originalResizeObserver);
    restoreGlobalProperty('DOMMatrixReadOnly', originalDOMMatrixReadOnly);
    restoreDescriptor(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidthDescriptor,
    );
    restoreDescriptor(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeightDescriptor,
    );
  };
}

describe('graph-view test setup', () => {
  it('installs and restores React Flow jsdom mocks without leaking module globals', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    const originalDOMMatrixReadOnly = globalThis.DOMMatrixReadOnly;
    const originalOffsetWidthDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetWidth',
    );
    const originalOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'offsetHeight',
    );

    expect(originalResizeObserver).not.toBe(
      ResizeObserverMock as typeof ResizeObserver,
    );
    expect(originalDOMMatrixReadOnly).not.toBe(
      DOMMatrixReadOnlyMock as typeof DOMMatrixReadOnly,
    );
    expect(originalOffsetWidthDescriptor?.get).not.toBe(getMockOffsetWidth);
    expect(originalOffsetHeightDescriptor?.get).not.toBe(getMockOffsetHeight);

    const restore = installGraphViewJSDomMocks();

    try {
      expect(globalThis.ResizeObserver).toBe(
        ResizeObserverMock as typeof ResizeObserver,
      );
      expect(globalThis.DOMMatrixReadOnly).toBe(
        DOMMatrixReadOnlyMock as typeof DOMMatrixReadOnly,
      );
      expect(
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')?.get,
      ).toBe(getMockOffsetWidth);
      expect(
        Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')?.get,
      ).toBe(getMockOffsetHeight);
    } finally {
      restore();
    }

    expect(globalThis.ResizeObserver).toBe(originalResizeObserver);
    expect(globalThis.DOMMatrixReadOnly).toBe(originalDOMMatrixReadOnly);
    expect(
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')?.get,
    ).toBe(originalOffsetWidthDescriptor?.get);
    expect(
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')?.get,
    ).toBe(originalOffsetHeightDescriptor?.get);
  });
});

describe('GraphView', () => {
  let restoreJSDomMocks: (() => void) | undefined;

  beforeEach(() => {
    restoreJSDomMocks = installGraphViewJSDomMocks();
  });

  afterEach(() => {
    restoreJSDomMocks?.();
    restoreJSDomMocks = undefined;
  });

  it('renders a React Flow graph shell with nodes and edges', async () => {
    const { container } = render(
      <GraphView
        graphTitle="Story Graph"
        nodes={[
          { id: 'scene-1', label: 'Opening' },
          { id: 'scene-2', label: 'Reveal' },
        ]}
        edges={[
          { id: 'edge-1', source: 'scene-1', target: 'scene-2' },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Story Graph' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();

    const graphArea = screen.getByTestId('graph-view-area');

    expect(graphArea.getAttribute('aria-label')).toBe('Graph canvas');
    await waitFor(() => {
      expect(container.querySelector('.react-flow')).toBeTruthy();
      expect(container.querySelectorAll('.react-flow__node')).toHaveLength(2);
      expect(container.querySelectorAll('.react-flow__edge')).toHaveLength(1);
    });
    expect(screen.getByText('Opening')).toBeTruthy();
    expect(screen.getByText('Reveal')).toBeTruthy();
  });
});
