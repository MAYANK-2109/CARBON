/**
 * @module features/calculator/TravelForm.test
 * @description Unit tests for TravelForm component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TravelForm } from './TravelForm';

describe('TravelForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders car specific fields initially', () => {
    render(<TravelForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/Transport Mode/i)).toHaveValue('car');
    expect(screen.getByLabelText(/Fuel Type/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Flight Distance Tier/i)).not.toBeInTheDocument();
  });

  it('changes fields when transport mode is flight', () => {
    render(<TravelForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    fireEvent.change(screen.getByLabelText(/Transport Mode/i), { target: { value: 'flight' } });
    
    expect(screen.queryByLabelText(/Fuel Type/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Flight Distance Tier/i)).toBeInTheDocument();
  });

  it('shows error when distance is unreasonably large', async () => {
    render(<TravelForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Set an unreasonably large distance to trigger Zod validation
    fireEvent.change(screen.getByLabelText(/Distance/i), { target: { value: '500000' } });
    
    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/Distance/i)).toHaveAttribute('aria-invalid', 'true');
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid data', async () => {
    render(<TravelForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    fireEvent.change(screen.getByLabelText(/Transport Mode/i), { target: { value: 'train' } });
    fireEvent.change(screen.getByLabelText(/Distance/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/Frequency/i), { target: { value: 'weekly' } });

    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        vehicleType: 'train',
        distanceKm: 200,
        frequency: 'weekly',
      });
    });
  });
});
