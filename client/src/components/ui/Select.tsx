import React, { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, containerClassName = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '16px' }} className={containerClassName}>
        {label && (
          <label
            htmlFor={selectId}
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
        <select
          id={selectId}
          ref={ref}
          className="glass-input glass-select"
          style={error ? { borderColor: 'var(--accent-rose)' } : undefined}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
