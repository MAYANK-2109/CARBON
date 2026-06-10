/**
 * @module components/ui/Markdown.test
 * @description Unit tests for the Markdown inline renderer.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders plain text', () => {
    render(<Markdown content="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders bold text wrapped in **', () => {
    render(<Markdown content="This is **bold** text" />);
    const bold = screen.getByText('bold');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renders inline code wrapped in backticks', () => {
    render(<Markdown content="Use `npm install` here" />);
    const code = screen.getByText('npm install');
    expect(code.tagName).toBe('CODE');
  });

  it('renders a bullet list for lines starting with dash', () => {
    const content = '- First item\n- Second item\n- Third item';
    const { container } = render(<Markdown content={content} />);
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
  });

  it('renders a bullet list for lines starting with asterisk', () => {
    const content = '* Apple\n* Orange';
    const { container } = render(<Markdown content={content} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders multiple paragraphs separated by double newlines', () => {
    const content = 'Paragraph one.\n\nParagraph two.';
    const { container } = render(<Markdown content={content} />);
    const paras = container.querySelectorAll('p');
    expect(paras).toHaveLength(2);
  });

  it('renders line breaks within a single paragraph', () => {
    const content = 'Line one\nLine two';
    const { container } = render(<Markdown content={content} />);
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('ignores empty string parts', () => {
    // A string with only delimiter text to test the empty-string guard
    render(<Markdown content="**bold**" />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });
});
