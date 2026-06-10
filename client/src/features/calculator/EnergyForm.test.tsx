/**
 * @module features/calculator/EnergyForm.test
 * @description Unit tests for EnergyForm component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnergyForm } from './EnergyForm';

describe('EnergyForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all energy inputs', () => {
    render(<EnergyForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/Electricity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Natural Gas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Heating Oil/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Billing Period/i)).toBeInTheDocument();
  });

  it('submits valid data', async () => {
    render(<EnergyForm onSubmit={mockOnSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/Electricity/i), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText(/Natural Gas/i), { target: { value: '50' } });

    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        electricityKwh: 150,
        naturalGasM3: 50,
        heatingOilLitres: 0,
        period: 'monthly',
      });
    });
  });
});
