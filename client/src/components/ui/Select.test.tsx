/**
 * @module components/ui/Select.test
 * @description Unit tests for the Select UI component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select options={OPTIONS} label="Pick one" id="select-1" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const { container } = render(<Select options={OPTIONS} id="select-2" />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders error message when error prop is set', () => {
    render(<Select options={OPTIONS} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('renders helperText when no error', () => {
    render(<Select options={OPTIONS} helperText="Choose wisely" />);
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('does not render helperText when error is present', () => {
    render(<Select options={OPTIONS} error="Error!" helperText="Some hint" />);
    expect(screen.queryByText('Some hint')).not.toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('applies error border style when error is provided', () => {
    render(<Select options={OPTIONS} error="Bad" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('is aria-invalid false when no error', () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
  });
});
