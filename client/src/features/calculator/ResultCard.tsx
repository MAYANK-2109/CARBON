import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CalculationResult } from '@carbon/shared';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { HeroCarbonOutput } from './components/HeroCarbonOutput';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { EnvironmentalEquivalents } from './components/EnvironmentalEquivalents';

/**
 * @interface ResultCardProps
 * @description Properties for the ResultCard component.
 */
interface ResultCardProps {
  /** The final calculation result */
  result: CalculationResult;
  /** Callback fired to reset the form and perform a new calculation */
  onReset: () => void;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * @component ResultCard
 * @description Displays the final results of a carbon emission calculation, including breakdown and equivalents.
 */
export const ResultCard: React.FC<ResultCardProps> = React.memo(({ result, onReset, isAuthenticated }) => {
  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }, []);

  const categoryColor = 
    result.category === 'travel' ? 'var(--accent-emerald)' :
    result.category === 'energy' ? 'var(--accent-sky)' :
    'var(--accent-amber)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
    >
      <HeroCarbonOutput
        totalCo2eKg={result.totalCo2eKg}
        annualizedCo2eKg={result.annualizedCo2eKg}
        categoryColor={categoryColor}
        isAuthenticated={isAuthenticated}
        formatNumber={formatNumber}
      />

      <CategoryBreakdown 
        breakdown={result.breakdown}
        categoryColor={categoryColor}
        formatNumber={formatNumber}
      />

      <EnvironmentalEquivalents 
        equivalents={result.equivalents}
        formatNumber={formatNumber}
      />

      {/* Form Action Controls */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Button
          onClick={onReset}
          variant="secondary"
          leftIcon={<RefreshCw size={16} aria-hidden="true" />}
          style={{ flexGrow: 1 }}
        >
          New Calculation
        </Button>
        {isAuthenticated && (
          <Button
            onClick={() => window.location.href = '/history'}
            variant="ghost"
            rightIcon={<ArrowRight size={16} aria-hidden="true" />}
            style={{ color: 'var(--accent-teal)' }}
          >
            View History
          </Button>
        )}
      </div>
    </motion.div>
  );
});

ResultCard.displayName = 'ResultCard';
