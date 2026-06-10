/**
 * @module features/chat/components/ChatSuggestions.test
 * @description Unit tests for the ChatSuggestions prompt grid component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatSuggestions } from './ChatSuggestions';

describe('ChatSuggestions', () => {
  it('renders the heading', () => {
    render(<ChatSuggestions onSelect={vi.fn()} />);
    expect(screen.getByText("How can I help with your footprint?")).toBeInTheDocument();
  });

  it('renders 4 suggestion buttons', () => {
    render(<ChatSuggestions onSelect={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('calls onSelect with the suggestion text when a button is clicked', () => {
    const onSelect = vi.fn();
    render(<ChatSuggestions onSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]!);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(typeof onSelect.mock.calls[0]?.[0]).toBe('string');
  });

  it('changes style on mouse enter and leave (hover states)', () => {
    render(<ChatSuggestions onSelect={vi.fn()} />);
    const btn = screen.getAllByRole('button')[0]!;
    fireEvent.mouseEnter(btn);
    expect(btn.style.color).toBe('var(--text-primary)');
    fireEvent.mouseLeave(btn);
    expect(btn.style.color).toBe('var(--text-secondary)');
  });
});
