/**
 * @module components/ui/Badge.test
 * @description Unit tests for the Badge component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies default emerald variant class', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstElementChild?.className).toContain('glass-badge-emerald');
  });

  it('applies specified variant class', () => {
    const { container, rerender } = render(<Badge variant="rose">Alert</Badge>);
    expect(container.firstElementChild?.className).toContain('glass-badge-rose');

    rerender(<Badge variant="sky">Info</Badge>);
    expect(container.firstElementChild?.className).toContain('glass-badge-sky');

    rerender(<Badge variant="amber">Warning</Badge>);
    expect(container.firstElementChild?.className).toContain('glass-badge-amber');

    rerender(<Badge variant="violet">Special</Badge>);
    expect(container.firstElementChild?.className).toContain('glass-badge-violet');
  });

  it('merges custom className', () => {
    const { container } = render(<Badge className="extra">Styled</Badge>);
    expect(container.firstElementChild?.className).toContain('extra');
    expect(container.firstElementChild?.className).toContain('glass-badge');
  });

  it('renders as a span element', () => {
    const { container } = render(<Badge>Span</Badge>);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });
});
