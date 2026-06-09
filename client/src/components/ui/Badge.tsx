import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'sky' | 'amber' | 'rose' | 'violet';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className = '',
}) => {
  return (
    <span className={`glass-badge glass-badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
