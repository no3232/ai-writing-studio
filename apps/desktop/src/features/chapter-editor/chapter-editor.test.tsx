// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChapterEditor } from './chapter-editor';

describe('ChapterEditor', () => {
  it('renders the chapter title, editor area, and save placeholder button', () => {
    render(
      <ChapterEditor
        chapterTitle="Chapter 01"
        initialContent="Kira stepped into the dueling circle before dawn."
      />,
    );

    expect(screen.getByRole('heading', { name: 'Chapter 01' })).toBeTruthy();
    expect(screen.getByTestId('chapter-editor-area')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });
});
