/**
 * @module components/ui/Button.test
 * @description Unit tests for the Button UI primitive.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('fires onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Save</Button>);
    // Should contain an SVG spinner
    const btn = screen.getByRole('button');
    const svg = btn.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies variant-specific CSS class', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button').className).toContain('glass-btn-primary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('glass-btn-ghost');

    rerender(<Button variant="rose">Rose</Button>);
    expect(screen.getByRole('button').className).toContain('glass-btn-rose');
  });

  it('defaults to secondary variant', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button').className).toContain('glass-btn-secondary');
  });

  it('renders left and right icons', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>} rightIcon={<span data-testid="right-icon">→</span>}>
        Navigate
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides icons when isLoading', () => {
    render(
      <Button isLoading leftIcon={<span data-testid="left-icon">←</span>}>
        Loading
      </Button>
    );

    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
  });

  it('passes HTML attributes through', () => {
    render(<Button type="submit" aria-label="Submit form">Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'Submit form');
  });
});
