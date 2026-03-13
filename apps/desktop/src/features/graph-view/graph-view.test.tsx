// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GraphView } from './graph-view';

describe('GraphView', () => {
  it('renders the graph title, graph area placeholder, counts, and save button', () => {
    render(
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
    expect(screen.getByTestId('graph-view-area')).toBeTruthy();
    expect(screen.getByText('Graph canvas')).toBeTruthy();
    expect(screen.getByText('2 nodes')).toBeTruthy();
    expect(screen.getByText('1 edge')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(screen.getByTestId('graph-view-area').getAttribute('data-graph-shell')).toBe('react-flow-ready');
  });
});
