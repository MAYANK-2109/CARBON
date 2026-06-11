/**
 * @module features/auth/LoginPage.test
 * @description Unit tests for the LoginPage component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

// Mock useAuth hook
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

// Mock useToast hook
vi.mock('../../components/feedback/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock GlassCard component
vi.mock('../../components/ui/GlassCard', () => ({
  GlassCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

interface MockInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Mock Input component
vi.mock('../../components/ui/Input', () => ({
  Input: ({ label, error, ...props }: MockInputProps) => (
    <input 
      {...props} 
    />
  ),
}));

// Mock Button component  
vi.mock('../../components/ui/Button', () => ({
  Button: ({ isLoading, variant, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean; variant?: string; children: React.ReactNode }) => (
    <button {...props} disabled={props.disabled || isLoading}>
      {children}
    </button>
  ),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      state: { from: { pathname: '/dashboard' } },
      pathname: '/login',
    }),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form heading', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In to CARBON')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
  });

  it('updates email input value on change', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('renders submit button with authenticate text', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /authenticate/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.textContent).toContain('Authenticate');
  });

  it('renders sign up link', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const signUpLink = screen.getByText(/create one free/i);
    expect(signUpLink).toBeInTheDocument();
  });

  it('renders form element', () => {
    const { container } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('renders password input field', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
  });
});
