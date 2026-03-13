// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KnowledgeEditor } from './knowledge-editor';

describe('KnowledgeEditor', () => {
  it('renders the document title, raw content area, and save placeholder button', () => {
    render(
      <KnowledgeEditor
        documentTitle="Kira Vale"
        rawContent="# Kira Vale"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Kira Vale' })).toBeTruthy();
    expect(screen.getByTestId('knowledge-raw-content-area')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });
});
