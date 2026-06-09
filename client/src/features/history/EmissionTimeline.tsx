import React from 'react';
import type { EmissionRecord } from '@carbon/shared';
import { Car, Zap, Utensils, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface EmissionTimelineProps {
  records: EmissionRecord[];
}

export const EmissionTimeline: React.FC<EmissionTimelineProps> = ({ records }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Car size={16} />;
      case 'energy': return <Zap size={16} />;
      case 'diet': return <Utensils size={16} />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel': return 'emerald';
      case 'energy': return 'sky';
      case 'diet': return 'amber';
      default: return 'violet';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (records.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Calendar size={32} style={{ marginBottom: '12px', color: 'var(--text-muted)' }} />
        <p style={{ fontSize: '15px' }}>No calculations recorded yet. Go to the Calculator to log your first activity!</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="glass-table">
        <thead>
          <tr>
            <th style={{ minWidth: '150px' }}>Date</th>
            <th>Category</th>
            <th>Activity Details</th>
            <th>Quantity</th>
            <th style={{ textAlign: 'right' }}>Emissions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {formatDate(record.createdAt)}
              </td>
              <td>
                <Badge variant={getCategoryColor(record.category)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {getCategoryIcon(record.category)}
                  </span>
                  <span style={{ marginLeft: '4px', textTransform: 'capitalize' }}>
                    {record.category}
                  </span>
                </Badge>
              </td>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {record.subcategory}
              </td>
              <td style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {record.inputValue.toLocaleString(undefined, { maximumFractionDigits: 1 })} {record.inputUnit}
              </td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {record.co2eKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
