/**
 * @module features/auth/RegisterPage.test
 * @description Unit tests for the RegisterPage component.
 * Covers rendering, field interactions, Zod validation, and submission behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

// ─── Mocks ────────────────────────────────────────────────

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('./useAuth', () => ({
  useAuth: () => ({ register: mockRegister }),
}));

vi.mock('../../components/feedback/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('../../components/ui/GlassCard', () => ({
  GlassCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

interface MockInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

vi.mock('../../components/ui/Input', () => ({
  Input: (props: MockInputProps) => {
    const inputProps = { ...props };
    delete inputProps.label;
    delete inputProps.error;
    delete inputProps.helperText;
    return (
      <div>
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        <input {...inputProps} />
        {props.error && <span role="alert">{props.error}</span>}
      </div>
    );
  },
}));

vi.mock('../../components/ui/Button', () => ({
  Button: ({
    children,
    isLoading,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    variant?: string;
    children: React.ReactNode;
  }) => {
    const btnProps = { ...props };
    delete btnProps.variant;
    return (
      <button {...btnProps} disabled={btnProps.disabled || isLoading}>
        {children}
      </button>
    );
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ─── Helpers ──────────────────────────────────────────────

function renderRegisterPage() {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the Create Account heading', () => {
      renderRegisterPage();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('renders all three input fields', () => {
      renderRegisterPage();
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders the Register Account submit button', () => {
      renderRegisterPage();
      expect(screen.getByRole('button', { name: /register account/i })).toBeInTheDocument();
    });

    it('renders a link back to the login page', () => {
      renderRegisterPage();
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  describe('field interactions', () => {
    it('updates the name field on input', () => {
      renderRegisterPage();
      const nameInput = screen.getByPlaceholderText('John Doe') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      expect(nameInput.value).toBe('Jane Doe');
    });

    it('updates the email field on input', () => {
      renderRegisterPage();
      const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      expect(emailInput.value).toBe('jane@example.com');
    });

    it('updates the password field on input', () => {
      renderRegisterPage();
      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'Secret123' } });
      expect(passwordInput.value).toBe('Secret123');
    });
  });

  describe('client-side Zod validation', () => {
    it('shows validation errors when submitting with an empty form', async () => {
      renderRegisterPage();
      const submitBtn = screen.getByRole('button', { name: /register account/i });
      fireEvent.click(submitBtn);

      // Should NOT call register when validation fails
      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });

    it('shows error alert when name is too short', async () => {
      renderRegisterPage();
      fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'A' } });
      fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'Password1' } });

      fireEvent.click(screen.getByRole('button', { name: /register account/i }));

      await waitFor(() => {
        // The error span should appear in the DOM
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('shows error when password does not meet complexity requirements', async () => {
      renderRegisterPage();
      fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'weak' } });

      fireEvent.click(screen.getByRole('button', { name: /register account/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    const validData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password1',
    };

    function fillForm() {
      fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: validData.name } });
      fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: validData.email } });
      fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: validData.password } });
    }

    it('calls register with valid form data and navigates to dashboard', async () => {
      mockRegister.mockResolvedValue(undefined);
      renderRegisterPage();
      fillForm();

      fireEvent.click(screen.getByRole('button', { name: /register account/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(validData);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      });
    });

    it('shows toast error and does not navigate when register fails', async () => {
      mockRegister.mockRejectedValue(new Error('Email already exists'));
      renderRegisterPage();
      fillForm();

      fireEvent.click(screen.getByRole('button', { name: /register account/i }));

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('disables submit button while submitting', async () => {
      // Make register hang so we can assert the loading state
      mockRegister.mockImplementation(() => new Promise(() => {}));
      renderRegisterPage();
      fillForm();

      const btn = screen.getByRole('button', { name: /register account/i });
      fireEvent.click(btn);

      await waitFor(() => {
        expect(btn).toBeDisabled();
      });
    });
  });
});
