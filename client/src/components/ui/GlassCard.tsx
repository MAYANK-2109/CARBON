import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glowColor?: 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'none';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = false,
  glowColor = 'none',
  className = '',
  ...props
}) => {
  const glowClass = glowColor !== 'none' ? `glass-glow-${glowColor}` : '';
  const hoverClass = hoverable ? 'glass-panel-hover glass-panel-interactive' : '';
  
  return (
    <div
      className={`glass-panel ${glowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
