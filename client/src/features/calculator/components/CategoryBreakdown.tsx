import React from 'react';
import type { EmissionBreakdown } from '@carbon/shared';

/**
 * @interface CategoryBreakdownProps
 * @description Properties for the CategoryBreakdown component.
 */
interface CategoryBreakdownProps {
  /** Array of breakdown items */
  breakdown: EmissionBreakdown[];
  /** Color theme for the bars */
  categoryColor: string;
  /** Formats a number to 1 decimal place */
  formatNumber: (num: number) => string;
}

/**
 * @component CategoryBreakdown
 * @description Displays a list of progress bars indicating the breakdown of emissions.
 */
export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = React.memo(({ breakdown, categoryColor, formatNumber }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
      <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500 }}>
        Category Breakdown
      </h4>
      <div 
        role="region"
        aria-labelledby="breakdown-title"
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {breakdown.map((item) => (
          <article
            key={item.subcategory}
            aria-label={`${item.subcategory}: ${formatNumber(item.co2eKg)} kilograms, ${formatNumber(item.percentage)} percent of total`}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-glass)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {formatNumber(item.co2eKg)} kg ({formatNumber(item.percentage)}%)
              </span>
            </div>
            <div 
              style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}
              role="progressbar"
              aria-valuenow={item.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.subcategory} emissions progress`}
            >
              <div
                style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  background: categoryColor,
                  borderRadius: '2px',
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});

CategoryBreakdown.displayName = 'CategoryBreakdown';
