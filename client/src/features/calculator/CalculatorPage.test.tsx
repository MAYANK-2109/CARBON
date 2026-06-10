/**
 * @module features/calculator/CalculatorPage.test
 * @description Unit tests for the CalculatorPage component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CalculatorPage } from './CalculatorPage';
import * as apiModule from '../../lib/api';

// Mock API
vi.mock('../../lib/api');

// Mock child components
vi.mock('./TravelForm', () => ({
  TravelForm: ({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) => (
    <button onClick={() => onSubmit({ mode: 'car', distance: 100 })}>Submit Travel</button>
  ),
}));

vi.mock('./EnergyForm', () => ({
  EnergyForm: ({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) => (
    <button onClick={() => onSubmit({ type: 'electricity', amount: 100 })}>Submit Energy</button>
  ),
}));

vi.mock('./DietForm', () => ({
  DietForm: ({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) => (
    <button onClick={() => onSubmit({ diet: 'mixed' })}>Submit Diet</button>
  ),
}));

vi.mock('./ResultCard', () => ({
  ResultCard: ({ result, onReset }: { result: Record<string, unknown>; onReset: () => void }) => (
    <div>
      <div data-testid="result">Result: {JSON.stringify(result)}</div>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

vi.mock('../../components/feedback/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    refreshProfile: vi.fn(),
  }),
}));

const mockResult = {
  totalCo2eKg: 100,
  annualizedCo2eKg: 1200,
  category: 'travel' as const,
  breakdown: [
    { subcategory: 'car', co2eKg: 100, percentage: 100 },
  ],
  equivalents: {
    treesNeeded: 10,
    drivingKm: 500,
    flightHours: 2,
  },
};

describe('CalculatorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders calculator tabs', () => {
    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Diet')).toBeInTheDocument();
  });

  it('renders active form initially', () => {
    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Submit Travel')).toBeInTheDocument();
  });

  it('shows result card after successful calculation', async () => {
    vi.mocked(apiModule.api.post).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockResult,
      },
    } as MockAxiosResponse);

    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Submit Travel'));

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });

  it('resets result when reset button is clicked', async () => {
    vi.mocked(apiModule.api.post).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockResult,
      },
    } as MockAxiosResponse);

    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Submit Travel'));

    await waitFor(() => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(screen.getByText('Submit Travel')).toBeInTheDocument();
    });
  });

  it('switches between tabs', () => {
    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Submit Travel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Energy'));

    expect(screen.getByText('Submit Energy')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('API Error');
    vi.mocked(apiModule.api.post).mockRejectedValueOnce(mockError);

    render(
      <BrowserRouter>
        <CalculatorPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Submit Travel'));

    await waitFor(() => {
      expect(screen.getByText('Submit Travel')).toBeInTheDocument();
    });
  });
});
