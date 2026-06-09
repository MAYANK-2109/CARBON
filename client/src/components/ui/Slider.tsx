import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  className = '',
}) => {
  return (
    <div className={`flex-col ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--accent-teal)',
            fontWeight: 500
          }}
        >
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};
