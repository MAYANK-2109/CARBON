import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../components/feedback/Toast';
import { TipCard } from './TipCard';
import { Skeleton } from '../../components/feedback/Skeleton';
import { Button } from '../../components/ui/Button';
import type { ReductionTip } from '@carbon/shared';
import { Lightbulb, Info } from 'lucide-react';

export const TipsPage: React.FC = () => {
  const { error: showToastError } = useToast();
  const [tips, setTips] = useState<ReductionTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      try {
        const catQuery = categoryFilter !== 'all' ? `?category=${categoryFilter}` : '';
        const res = await api.get<{ success: boolean; data: ReductionTip[] }>(`/tips${catQuery}`);
        if (res.data.success) {
          setTips(res.data.data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve reduction tips.';
        showToastError(message, 'Fetch Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [categoryFilter, showToastError]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glass)',
          background: 'rgba(255, 255, 255, 0.01)',
          textAlign: 'left'
        }}
      >
        <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Lightbulb size={24} style={{ color: 'var(--accent-amber)' }} /> Actionable Climate Action Plans
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={14} /> Read peer-reviewed reduction tips sorted by impact level. Start implementing these habits to lower your footprint.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'travel', 'energy', 'diet', 'general'].map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? 'primary' : 'secondary'}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '8px',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid of Tip Cards */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <Skeleton height={200} />
          <Skeleton height={200} />
          <Skeleton height={200} />
          <Skeleton height={200} />
        </div>
      ) : tips.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No tips found for the selected category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {tips.map((tip) => (
            <div key={tip.id} className="anim-slide-up">
              <TipCard tip={tip} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
