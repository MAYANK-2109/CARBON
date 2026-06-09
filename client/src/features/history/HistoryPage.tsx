import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../components/feedback/Toast';
import { BentoGrid } from '../../components/layout/BentoGrid';
import { BentoTile } from '../../components/layout/BentoTile';
import { TrendChart } from './TrendChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { EmissionTimeline } from './EmissionTimeline';
import { Skeleton } from '../../components/feedback/Skeleton';
import { Button } from '../../components/ui/Button';
import type { PaginatedHistory, EmissionSummary, MonthlyTrend, TrendDataPoint } from '@carbon/shared';
import { TrendingUp, PieChart, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { error: showToastError } = useToast();
  const [historyData, setHistoryData] = useState<PaginatedHistory | null>(null);
  const [summaryData, setSummaryData] = useState<EmissionSummary | null>(null);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catQuery = categoryFilter !== 'all' ? `&category=${categoryFilter}` : '';
        const [historyRes, summaryRes, trendsRes] = await Promise.all([
          api.get<{ success: boolean; data: PaginatedHistory }>(`/history?page=${page}&limit=10${catQuery}`),
          api.get<{ success: boolean; data: EmissionSummary }>('/history/summary'),
          api.get<{ success: boolean; data: MonthlyTrend[] }>('/history/trends'),
        ]);

        if (historyRes.data.success) setHistoryData(historyRes.data.data);
        if (summaryRes.data.success) setSummaryData(summaryRes.data.data);
        if (trendsRes.data.success) setTrendData(trendsRes.data.data);
      } catch (err: any) {
        showToastError(err.message || 'Failed to retrieve history logs.', 'Fetch Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, categoryFilter, showToastError]);

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (historyData && page < historyData.totalPages) setPage((p) => p + 1);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setPage(1); // Reset page on filter change
  };

  // Convert MonthlyTrend to TrendDataPoint array for TrendChart
  const getTrendDataPoints = (): TrendDataPoint[] => {
    if (trendData.length === 0) return [];
    
    return trendData.map((t) => {
      // Map month name to a date string representation
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <BentoGrid>
          <BentoTile span={8} title="Loading Trend Analysis..." icon={<TrendingUp size={16} />}>
            <Skeleton height={260} />
          </BentoTile>
          <BentoTile span={4} title="Loading Breakdown..." icon={<PieChart size={16} />}>
            <Skeleton height={260} />
          </BentoTile>
          <BentoTile span={12} title="Loading Activity Log..." icon={<FileText size={16} />}>
            <Skeleton height={200} />
          </BentoTile>
        </BentoGrid>
      </div>
    );
  }

  const trendsPoints = getTrendDataPoints();
  const summaryBreakdown = summaryData?.byCategory || { travel: 0, energy: 0, diet: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Charts Section */}
      <BentoGrid>
        <BentoTile
          span={8}
          title="Emissions Trend over Time"
          icon={<TrendingUp size={16} />}
          glowColor="emerald"
        >
          {trendsPoints.length > 0 ? (
            <TrendChart dataPoints={trendsPoints} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--text-secondary)' }}>
              Add calculator entries to generate monthly trend charts.
            </div>
          )}
        </BentoTile>

        <BentoTile
          span={4}
          title="Category Distribution"
          icon={<PieChart size={16} />}
          glowColor="sky"
        >
          {summaryData && summaryData.totalCo2eKg > 0 ? (
            <CategoryBreakdown
              travel={summaryBreakdown.travel}
              energy={summaryBreakdown.energy}
              diet={summaryBreakdown.diet}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--text-secondary)' }}>
              No categories recorded yet.
            </div>
          )}
        </BentoTile>

        {/* Calculation Timeline Log */}
        <BentoTile
          span={12}
          title="Activity Log Timeline"
          icon={<FileText size={16} />}
          glowColor="violet"
        >
          {/* Filters Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'travel', 'energy', 'diet'].map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'primary' : 'secondary'}
                  onClick={() => handleCategoryFilterChange(cat)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Pagination Controls */}
            {historyData && historyData.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Page {historyData.page} of {historyData.totalPages}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    style={{ padding: '6px 8px', borderRadius: '6px' }}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={page === historyData.totalPages}
                    style={{ padding: '6px 8px', borderRadius: '6px' }}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <EmissionTimeline records={historyData?.records || []} />
        </BentoTile>
      </BentoGrid>
    </div>
  );
};
