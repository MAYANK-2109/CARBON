/**
 * @module features/calculator/DietForm.test
 * @description Unit tests for the DietForm component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DietForm } from './DietForm';

describe('DietForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all food categories as sliders', () => {
    render(<DietForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByText('Beef')).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
    expect(screen.getByText('Dairy')).toBeInTheDocument();
  });

  it('submits form with valid slider data', async () => {
    render(<DietForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Mock changing the "Beef" slider. The Slider uses a standard range input.
    // The closest input to the text "Beef" is the slider in that group.
    const sliders = screen.getAllByRole('slider');
    // First slider is Beef
    fireEvent.change(sliders[0]!, { target: { value: '2' } });

    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        items: [{ category: 'beef', kgPerWeek: 2 }],
      });
    });
  });

  it('shows an alert and does not submit if all items are 0', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<DietForm onSubmit={mockOnSubmit} isLoading={false} />);

    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);

    expect(alertSpy).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('shows loading state on submit button', () => {
    render(<DietForm onSubmit={mockOnSubmit} isLoading={true} />);
    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
    // Loading state is handled by the generic Button component we tested earlier
  });
});
