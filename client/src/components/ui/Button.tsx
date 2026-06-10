import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'glass-btn-primary';
      case 'rose': return 'glass-btn-rose';
      case 'ghost': return 'glass-btn-ghost';
      case 'secondary':
      default:
        return 'glass-btn-secondary';
    }
  };

  const buttonStyle = size !== 'md' ? {
    padding: size === 'sm' ? '8px 16px' : '14px 32px',
    fontSize: size === 'sm' ? '14px' : '18px',
  } : undefined;

  return (
    <button
      className={`glass-btn ${getVariantClass()} ${className} ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
      style={buttonStyle}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="spin-loader"
          style={{ width: '16px', height: '16px', marginRight: '6px' }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span style={{ display: 'inline-flex', marginRight: '4px' }}>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span style={{ display: 'inline-flex', marginLeft: '4px' }}>{rightIcon}</span>}
    </button>
  );
};
