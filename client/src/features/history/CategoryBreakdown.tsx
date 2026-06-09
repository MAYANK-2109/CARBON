import React from 'react';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownProps {
  travel: number;
  energy: number;
  diet: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  travel,
  energy,
  diet,
}) => {
  const total = travel + energy + diet;
  
  const chartData = {
    labels: ['Travel', 'Energy', 'Diet'],
    datasets: [
      {
        data: [travel, energy, diet],
        backgroundColor: [
          '#10b981', // var(--accent-emerald)
          '#0ea5e9', // var(--accent-sky)
          '#f59e0b', // var(--accent-amber)
        ],
        borderColor: '#0f1016', // var(--bg-secondary)
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'var(--font-heading)', size: 12, weight: 500 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0f1016',
        titleFont: { family: 'var(--font-heading)', size: 12 },
        bodyFont: { family: 'var(--font-sans)', size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const val = context.parsed;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return ` ${context.label}: ${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '260px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ flexGrow: 1, width: '100%', position: 'relative' }}>
        <Doughnut data={chartData} options={options} />
        {/* Absolute Center Counter */}
        <div
          style={{
            position: 'absolute',
            top: '44%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total kg
          </div>
        </div>
      </div>
    </div>
  );
};
