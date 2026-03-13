// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlotChatPanel } from './plot-chat-panel';

describe('PlotChatPanel', () => {
  it('renders assistant messaging, prompt input, filters, and agent view toggles', () => {
    render(
      <PlotChatPanel
        assistantMessage="Choose which tension to escalate next."
      />,
    );

    expect(screen.getByText('Choose which tension to escalate next.')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Prompt' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Plot' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Character' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Validation' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Unified View' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agent View' })).toBeTruthy();
  });
});
