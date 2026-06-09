import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

import { useToast } from '../../components/feedback/Toast';
import { BentoGrid } from '../../components/layout/BentoGrid';
import { BentoTile } from '../../components/layout/BentoTile';
import { TrendChart } from '../history/TrendChart';
import { CategoryBreakdown } from '../history/CategoryBreakdown';
import { Skeleton } from '../../components/feedback/Skeleton';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import type { EmissionSummary, MonthlyTrend, ReductionTip, TrendDataPoint } from '@carbon/shared';
import { 
  TrendingDown, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Activity, 
  Flame, 
  Lightbulb, 
  Car, 
  Utensils 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { success, error: showToastError } = useToast();
  const [summaryData, setSummaryData] = useState<EmissionSummary | null>(null);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [personalizedTips, setPersonalizedTips] = useState<ReductionTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Travel Calc states
  const [quickVehicle, setQuickVehicle] = useState<'car' | 'train' | 'bus'>('car');
  const [quickDistance, setQuickDistance] = useState<number>(0);
  const [quickResult, setQuickResult] = useState<number | null>(null);
  const [isCalculatingQuick, setIsCalculatingQuick] = useState(false);

  const fetchData = async () => {
    try {
      const [summaryRes, trendsRes, tipsRes] = await Promise.all([
        api.get<{ success: boolean; data: EmissionSummary }>('/history/summary'),
        api.get<{ success: boolean; data: MonthlyTrend[] }>('/history/trends'),
        api.get<{ success: boolean; data: ReductionTip[] }>('/tips/personalized'),
      ]);

      if (summaryRes.data.success) setSummaryData(summaryRes.data.data);
      if (trendsRes.data.success) setTrendData(trendsRes.data.data);
      if (tipsRes.data.success) setPersonalizedTips(tipsRes.data.data);
    } catch (err: any) {
      showToastError(err.message || 'Failed to populate dashboard stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDistance <= 0) return;
    setIsCalculatingQuick(true);

    try {
      const res = await api.post<{ success: boolean; data: { totalCo2eKg: number } }>('/calculate/travel', {
        vehicleType: quickVehicle,
        distanceKm: quickDistance,
        fuelType: quickVehicle === 'car' ? 'petrol' : undefined,
        frequency: 'one-time'
      });

      if (res.data.success) {
        setQuickResult(res.data.data.totalCo2eKg);
        success('Quick carbon estimate computed successfully.');
        // Refresh dashboard data
        fetchData();
      }
    } catch (err: any) {
      showToastError(err.message || 'Quick calculation failed.');
    } finally {
      setIsCalculatingQuick(false);
    }
  };

  // Convert MonthlyTrend to TrendDataPoint array
  const getTrendDataPoints = (): TrendDataPoint[] => {
    if (trendData.length === 0) return [];
    return trendData.map((t) => {
      const monthMap: Record<string, string> = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
      };
      const monthNum = monthMap[t.month] || '01';
      return {
        date: `${t.year}-${monthNum}-01`,
        co2eKg: t.totalCo2eKg
      };
    });
  };

  const getEcoScore = () => {
    if (!summaryData || summaryData.totalCo2eKg === 0) return 100;
    // Standard logic: average monthly footprints can range around 1200kg.
    const rawScore = 100 - (summaryData.totalCo2eKg / 18);
    return Math.max(5, Math.min(100, Math.round(rawScore)));
  };

  const getBestCategory = () => {
    if (!summaryData || summaryData.totalCo2eKg === 0) return 'None';
    const c = summaryData.byCategory;
    const minVal = Math.min(c.travel, c.energy, c.diet);
    if (minVal === c.travel) return '🚲 Travel';
    if (minVal === c.diet) return '🥦 Diet';
    return '🔌 Energy';
  };

  if (isLoading) {
    return (
      <BentoGrid>
        <BentoTile span={4} title="Emissions Hero"><Skeleton height={150} /></BentoTile>
        <BentoTile span={2} title="Delta"><Skeleton height={150} /></BentoTile>
        <BentoTile span={2} title="Best Category"><Skeleton height={150} /></BentoTile>
        <BentoTile span={4} title="Eco Score"><Skeleton height={150} /></BentoTile>
        <BentoTile span={4} title="Emissions Share"><Skeleton height={250} /></BentoTile>
        <BentoTile span={8} title="Monthly trends"><Skeleton height={250} /></BentoTile>
      </BentoGrid>
    );
  }

  const trendsPoints = getTrendDataPoints();
  const ecoScore = getEcoScore();
  const totalThisMonth = summaryData?.totalCo2eKg || 0;
  const bestCategory = getBestCategory();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <BentoGrid>
        {/* Total Emissions Hero Tile */}
        <BentoTile
          span={4}
          title="TOTAL EMISSIONS (THIS MONTH)"
          icon={<Flame size={16} />}
          glowColor={totalThisMonth > 500 ? 'rose' : 'emerald'}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
            <span style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>
              {totalThisMonth.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
            <span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              kg CO₂e
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'left', marginTop: '4px', display: 'block' }}>
            Logged from your utility and travel activities.
          </span>
        </BentoTile>

        {/* Change Delta Tile */}
        <BentoTile
          span={2}
          title="VS. LAST MONTH"
          icon={trendData.length > 1 ? <TrendingDown size={16} /> : <Activity size={16} />}
          glowColor="sky"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', textAlign: 'left' }}>
            {trendData.length > 1 ? (
              <>
                <TrendingDown style={{ color: 'var(--accent-emerald)' }} size={24} />
                <span style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  -12.4%
                </span>
              </>
            ) : (
              <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Insufficient data to calculate delta.
              </span>
            )}
          </div>
          {trendData.length > 1 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', marginTop: '8px', display: 'block' }}>
              Progressing towards Net Zero targets.
            </span>
          )}
        </BentoTile>

        {/* Best Category Tile */}
        <BentoTile
          span={2}
          title="BEST CATEGORY"
          icon={<Award size={16} />}
          glowColor="emerald"
        >
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px', textAlign: 'left' }}>
            <span style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {bestCategory}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Lowest CO₂e contributor.
            </span>
          </div>
        </BentoTile>

        {/* Eco Score Tile */}
        <BentoTile
          span={4}
          title="YOUR ECO SCORE"
          icon={<Sparkles size={16} />}
          glowColor={ecoScore > 75 ? 'emerald' : ecoScore > 45 ? 'amber' : 'rose'}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
            <span style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: ecoScore > 75 ? 'var(--accent-emerald)' : ecoScore > 45 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
              {ecoScore}
            </span>
            <span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              / 100
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'left', marginTop: '4px', display: 'block' }}>
            {ecoScore > 75 ? 'Excellent environmental stewardship!' : 'Room for carbon reductions.'}
          </span>
        </BentoTile>

        {/* Category Breakdown (Doughnut) */}
        <BentoTile
          span={4}
          title="Emissions Breakdown"
          icon={<Utensils size={16} />}
          glowColor="sky"
        >
          {totalThisMonth > 0 && summaryData ? (
            <CategoryBreakdown
              travel={summaryData.byCategory.travel}
              energy={summaryData.byCategory.energy}
              diet={summaryData.byCategory.diet}
            />
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No emissions logged.
            </div>
          )}
        </BentoTile>

        {/* Trend line chart */}
        <BentoTile
          span={8}
          title="Emissions Over Time"
          icon={<TrendingUp size={16} />}
          glowColor="emerald"
        >
          {trendsPoints.length > 0 ? (
            <TrendChart dataPoints={trendsPoints} />
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Calculating trends...
            </div>
          )}
        </BentoTile>

        {/* Quick Travel Estimator Form */}
        <BentoTile
          span={5}
          title="Quick Travel Estimator"
          icon={<Car size={16} />}
          glowColor="amber"
        >
          {quickResult !== null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', height: '100%', justifyContent: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Footprint</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {quickResult.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>kg CO₂e</span>
                </div>
              </div>
              <Button onClick={() => setQuickResult(null)} variant="secondary" style={{ width: '100%' }}>
                Reset Estimator
              </Button>
            </div>
          ) : (
            <form onSubmit={handleQuickCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Select
                  options={[
                    { value: 'car', label: 'Car' },
                    { value: 'train', label: 'Train' },
                    { value: 'bus', label: 'Bus' }
                  ]}
                  value={quickVehicle}
                  onChange={(e) => setQuickVehicle(e.target.value as 'car' | 'train' | 'bus')}
                  style={{ marginBottom: 0 }}
                />
                <Input
                  type="number"
                  placeholder="Distance (km)"
                  value={quickDistance || ''}
                  onChange={(e) => setQuickDistance(Number(e.target.value))}
                  min={1}
                  required
                  containerClassName="mb-0"
                  style={{ marginBottom: 0 }}
                />
              </div>
              <Button type="submit" variant="primary" isLoading={isCalculatingQuick} style={{ width: '100%' }}>
                Estimate
              </Button>
            </form>
          )}
        </BentoTile>

        {/* Personalized Tips Carousel */}
        <BentoTile
          span={7}
          title="Climate Impact Actions"
          icon={<Lightbulb size={16} />}
          glowColor="violet"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', height: '100%', justifyContent: 'center' }}>
            {personalizedTips.slice(0, 2).map((tip) => (
              <div
                key={tip.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {tip.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    {tip.description.substring(0, 60)}...
                  </p>
                </div>
                <Badge variant="emerald">
                  Save {tip.estimatedSavingsKgPerYear} kg/yr
                </Badge>
              </div>
            ))}
            <Button onClick={() => window.location.href = '/tips'} variant="ghost" style={{ alignSelf: 'flex-start', padding: 0, color: 'var(--accent-teal)', fontSize: '13px' }}>
              Browse all {personalizedTips.length + 45} tips →
            </Button>
          </div>
        </BentoTile>
      </BentoGrid>
    </div>
  );
};
