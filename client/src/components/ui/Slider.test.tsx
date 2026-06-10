/**
 * @module components/ui/Slider.test
 * @description Unit tests for the Slider UI component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders the label', () => {
    render(<Slider label="Speed" min={0} max={100} value={50} onChange={vi.fn()} />);
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<Slider label="Volume" min={0} max={10} value={7} onChange={vi.fn()} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays value with unit', () => {
    render(<Slider label="Distance" min={0} max={500} value={120} onChange={vi.fn()} unit="km" />);
    expect(screen.getByText('120 km')).toBeInTheDocument();
  });

  it('calls onChange with numeric value when dragged', () => {
    const onChange = vi.fn();
    render(<Slider label="Power" min={0} max={100} value={10} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('renders range input with correct min/max/step', () => {
    render(<Slider label="Steps" min={10} max={200} step={5} value={50} onChange={vi.fn()} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '200');
    expect(slider).toHaveAttribute('step', '5');
  });
});
