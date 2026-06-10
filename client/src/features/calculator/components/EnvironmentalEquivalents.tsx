import React from 'react';
import { Trees, Car, Plane } from 'lucide-react';

/**
 * @interface EnvironmentalEquivalentsProps
 * @description Properties for the EnvironmentalEquivalents component.
 */
interface EnvironmentalEquivalentsProps {
  /** Environmental equivalents of the calculated carbon footprint */
  equivalents: {
    treesNeeded: number;
    drivingKm: number;
    flightsLondon2NY: number;
  };
  /** Formats a number to 1 decimal place */
  formatNumber: (num: number) => string;
}

/**
 * @component EnvironmentalEquivalents
 * @description Displays relatable comparisons (trees, driving, flights) for the calculated footprint.
 */
export const EnvironmentalEquivalents: React.FC<EnvironmentalEquivalentsProps> = React.memo(({ equivalents, formatNumber }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
      <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500 }}>
        Environmental Equivalents
      </h4>
      <div 
        role="region"
        aria-labelledby="equivalents-title"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}
      >
        <article
          aria-label={`Trees needed per year: ${formatNumber(equivalents.treesNeeded)}`}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            background: 'rgba(16, 185, 129, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Trees size={24} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
          <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatNumber(equivalents.treesNeeded)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Trees needed / year
          </span>
        </article>

        <article
          aria-label={`Kilometers driven equivalent: ${formatNumber(equivalents.drivingKm)}`}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            background: 'rgba(245, 158, 11, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Car size={24} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
          <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatNumber(equivalents.drivingKm)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Km driven equivalent
          </span>
        </article>

        <article
          aria-label={`London to NY flights equivalent: ${formatNumber(equivalents.flightsLondon2NY)}`}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(14, 165, 233, 0.1)',
            background: 'rgba(14, 165, 233, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Plane size={24} style={{ color: 'var(--accent-sky)' }} aria-hidden="true" />
          <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatNumber(equivalents.flightsLondon2NY)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            London ⇄ NY flights
          </span>
        </article>
      </div>
    </div>
  );
});

EnvironmentalEquivalents.displayName = 'EnvironmentalEquivalents';
