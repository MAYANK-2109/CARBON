/**
 * @module components/ui/GlassCard.test
 * @description Unit tests for the GlassCard UI component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard><p>Content</p></GlassCard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies glass-panel base class', () => {
    const { container } = render(<GlassCard>Test</GlassCard>);
    expect(container.firstElementChild?.className).toContain('glass-panel');
  });

  it('applies glow class when glowColor is specified', () => {
    const { container } = render(<GlassCard glowColor="emerald">Glow</GlassCard>);
    expect(container.firstElementChild?.className).toContain('glass-glow-emerald');
  });

  it('does not apply glow class when glowColor is none', () => {
    const { container } = render(<GlassCard glowColor="none">No Glow</GlassCard>);
    expect(container.firstElementChild?.className).not.toContain('glass-glow');
  });

  it('applies hover classes when hoverable', () => {
    const { container } = render(<GlassCard hoverable>Hover</GlassCard>);
    const el = container.firstElementChild;
    expect(el?.className).toContain('glass-panel-hover');
    expect(el?.className).toContain('glass-panel-interactive');
  });

  it('does not apply hover classes by default', () => {
    const { container } = render(<GlassCard>Static</GlassCard>);
    expect(container.firstElementChild?.className).not.toContain('glass-panel-hover');
  });

  it('merges custom className', () => {
    const { container } = render(<GlassCard className="custom-class">Custom</GlassCard>);
    expect(container.firstElementChild?.className).toContain('custom-class');
    expect(container.firstElementChild?.className).toContain('glass-panel');
  });

  it('passes through HTML attributes', () => {
    render(<GlassCard data-testid="card" role="region">Accessible</GlassCard>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'region');
  });
});
