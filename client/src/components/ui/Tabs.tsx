import React from 'react';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={className}
      style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        padding: '4px',
        width: 'fit-content',
        gap: '4px'
      }}
    >
      {options.map((opt) => {
        const isActive = opt.id === activeTab;
        return (
          <button
            key={opt.id}
            id={`tab-${opt.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${opt.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'calc(var(--radius-md) - 4px)',
              fontSize: '14px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-glass-active)' : 'transparent',
              border: isActive ? '1px solid var(--border-glass-hover)' : '1px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            {opt.icon && <span style={{ display: 'flex' }}>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
