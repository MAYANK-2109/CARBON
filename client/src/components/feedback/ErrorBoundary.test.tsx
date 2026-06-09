/**
 * @module components/feedback/ErrorBoundary.test
 * @description Unit tests for the ErrorBoundary component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error on render
function BrokenComponent(): never {
  throw new Error('Test error message');
}

function WorkingComponent() {
  return <div>Everything is fine</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected error boundary triggers
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('renders error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('displays the error message', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders a reload button', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });
});
