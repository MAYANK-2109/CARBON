import React from 'react';

/**
 * @interface HeroCarbonOutputProps
 * @description Properties for the HeroCarbonOutput component.
 */
interface HeroCarbonOutputProps {
  /** The total carbon footprint calculated, in kg CO2e */
  totalCo2eKg: number;
  /** The annualized carbon footprint, in kg CO2e */
  annualizedCo2eKg: number;
  /** Hex or var color based on the category for styling */
  categoryColor: string;
  /** Whether the user is authenticated (shows auto-save text) */
  isAuthenticated: boolean;
  /** Formats a number to 1 decimal place */
  formatNumber: (num: number) => string;
}

/**
 * @component HeroCarbonOutput
 * @description Renders the large, heroic display of the final carbon calculation result.
 */
export const HeroCarbonOutput: React.FC<HeroCarbonOutputProps> = React.memo(({
  totalCo2eKg,
  annualizedCo2eKg,
  categoryColor,
  isAuthenticated,
  formatNumber
}) => {
  return (
    <div
      role="region"
      aria-labelledby="carbon-result-title"
      style={{
        padding: '32px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-glass)',
        background: 'rgba(255, 255, 255, 0.01)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: categoryColor,
          filter: 'blur(100px)',
          opacity: 0.1,
          pointerEvents: 'none'
        }}
      />

      <span 
        id="carbon-result-title"
        style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}
      >
        Calculated Carbon Emissions
      </span>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0' }}>
        <span
          aria-label={`${formatNumber(totalCo2eKg)} kilograms of carbon dioxide equivalent`}
          style={{
            fontSize: '56px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-1.5px'
          }}
        >
          {formatNumber(totalCo2eKg)}
        </span>
        <span aria-hidden="true" style={{ fontSize: '20px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          kg CO₂e
        </span>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Annualized equivalent:</span>
        <span aria-label={`${formatNumber(annualizedCo2eKg)} kilograms per year`}>{formatNumber(annualizedCo2eKg)} kg / year</span>
      </div>

      {isAuthenticated && (
        <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', marginTop: '8px', fontWeight: 500 }}>
          ✓ Calculation auto-saved to your profile log
        </span>
      )}
    </div>
  );
});

HeroCarbonOutput.displayName = 'HeroCarbonOutput';
