import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
}) => {
  const getBorderRadius = () => {
    if (variant === 'circular') return '50%';
    if (variant === 'text') return '4px';
    return 'var(--radius-md)';
  };

  const skeletonStyle: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? (variant === 'text' ? '1rem' : '100px'),
    borderRadius: getBorderRadius(),
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
    ...style,
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      <div className={className} style={skeletonStyle} />
    </>
  );
};
