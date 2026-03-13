// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnlyMock {
  m11 = 1;

  m22 = 1;

  m41 = 0;

  m42 = 0;
} as typeof DOMMatrixReadOnly;
Object.defineProperties(HTMLElement.prototype, {
  offsetWidth: {
    configurable: true,
    get() {
      return this.getAttribute('data-testid')?.startsWith('rf__node-') ? 120 : 640;
    },
  },
  offsetHeight: {
    configurable: true,
    get() {
      return this.getAttribute('data-testid')?.startsWith('rf__node-') ? 48 : 320;
    },
  },
});

describe('GraphView', () => {
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
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();

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
