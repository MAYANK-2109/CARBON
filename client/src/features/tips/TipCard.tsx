import React from 'react';
import type { ReductionTip } from '@carbon/shared';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Leaf, Plane, Home, Shield, Award } from 'lucide-react';

interface TipCardProps {
  tip: ReductionTip;
}

export const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane size={18} />;
      case 'energy': return <Home size={18} />;
      case 'diet': return <Leaf size={18} />;
      default: return <Shield size={18} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'rose';
      case 'medium': return 'amber';
      case 'low':
      default:
        return 'emerald';
    }
  };

  return (
    <GlassCard
      hoverable
      glowColor={getImpactColor(tip.impactLevel)}
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        background: 'var(--bg-secondary)',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            color: 'var(--text-primary)',
            padding: '8px',
            background: 'var(--bg-glass-active)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {getCategoryIcon(tip.category)}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant={getImpactColor(tip.impactLevel)}>
            {tip.impactLevel.toUpperCase()} IMPACT
          </Badge>
        </div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
          {tip.title}
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {tip.description}
        </p>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent-emerald)',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        <Award size={16} />
        <span>Saves ~{tip.estimatedSavingsKgPerYear.toLocaleString()} kg CO₂e / yr</span>
      </div>
    </GlassCard>
  );
};
