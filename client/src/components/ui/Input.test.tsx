/**
 * @module components/ui/Input.test
 * @description Unit tests for the Input form component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Username" id="username" />);
    const input = screen.getByLabelText('Username');
    expect(input.id).toBe('username');
  });

  it('displays error message', () => {
    render(<Input error="Required field" id="field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Invalid" id="test-field" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('displays helper text when no error', () => {
    render(<Input helperText="Optional info" id="helper-field" />);
    expect(screen.getByText('Optional info')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input helperText="Optional" error="Required" id="conflict-field" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Optional')).not.toBeInTheDocument();
  });

  it('handles onChange events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type" />);

    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('passes through HTML attributes (type, disabled)', () => {
    render(<Input type="password" disabled placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeDisabled();
  });

  it('applies glass-input CSS class', () => {
    render(<Input placeholder="styled" />);
    const input = screen.getByPlaceholderText('styled');
    expect(input.className).toContain('glass-input');
  });
});
