import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, containerClassName = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`flex-col` + (containerClassName ? ` ${containerClassName}` : '')} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textAlign: 'left'
            }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`glass-input`}
          style={error ? { borderColor: 'var(--accent-rose)' } : undefined}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={errorId}
            style={{
              fontSize: '12px',
              color: 'var(--accent-rose)',
              marginTop: '2px',
              textAlign: 'left'
            }}
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span
            id={helperId}
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
              textAlign: 'left'
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
