// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TimelineView } from './timeline-view';

describe('TimelineView', () => {
  it('renders timeline items in ascending order', () => {
    render(
      <TimelineView
        timelineTitle="Story Timeline"
        items={[
          { id: 'beat-3', title: 'Climax', order: 30 },
          { id: 'beat-1', title: 'Opening Image', order: 10 },
          { id: 'beat-2', title: 'Midpoint Turn', order: 20 },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Story Timeline' })).toBeTruthy();

    const list = screen.getByRole('list', { name: 'Timeline items' });
    const renderedItems = within(list)
      .getAllByRole('listitem')
      .map((item) => item.textContent);

    expect(renderedItems).toEqual([
      '10. Opening Image',
      '20. Midpoint Turn',
      '30. Climax',
    ]);
  });
});
