import React from 'react';
import { motion } from 'framer-motion';
import type { CalculationResult } from '@carbon/shared';
import { Trees, Car, Plane, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ResultCardProps {
  result: CalculationResult;
  onReset: () => void;
  isAuthenticated: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, isAuthenticated }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

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
      {/* Hero Carbon Output */}
      <div
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

        <span style={{ fontSize: '14px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Calculated Carbon Emissions
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0' }}>
          <span
            style={{
              fontSize: '56px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-1.5px'
            }}
          >
            {formatNumber(result.totalCo2eKg)}
          </span>
          <span style={{ fontSize: '20px', color: 'var(--text-secondary)', fontWeight: 500 }}>
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
          <span>{formatNumber(result.annualizedCo2eKg)} kg / year</span>
        </div>

        {isAuthenticated && (
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', marginTop: '8px', fontWeight: 500 }}>
            ✓ Calculation auto-saved to your profile log
          </span>
        )}
      </div>

      {/* Granular Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Category Breakdown
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result.breakdown.map((item) => (
            <div
              key={item.subcategory}
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
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
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
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Equivalents */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Environmental Equivalents
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {/* Trees */}
          <div
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
            <Trees size={24} style={{ color: 'var(--accent-emerald)' }} />
            <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatNumber(result.equivalents.treesNeeded)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Trees needed / year
            </span>
          </div>

          {/* Car */}
          <div
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
            <Car size={24} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatNumber(result.equivalents.drivingKm)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Km driven equivalent
            </span>
          </div>

          {/* Flight */}
          <div
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
            <Plane size={24} style={{ color: 'var(--accent-sky)' }} />
            <span style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatNumber(result.equivalents.flightsLondon2NY)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              London ⇄ NY flights
            </span>
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Button
          onClick={onReset}
          variant="secondary"
          leftIcon={<RefreshCw size={16} />}
          style={{ flexGrow: 1 }}
        >
          New Calculation
        </Button>
        {isAuthenticated && (
          <Button
            onClick={() => window.location.href = '/history'}
            variant="ghost"
            rightIcon={<ArrowRight size={16} />}
            style={{ color: 'var(--accent-teal)' }}
          >
            View History
          </Button>
        )}
      </div>
    </motion.div>
  );
};
