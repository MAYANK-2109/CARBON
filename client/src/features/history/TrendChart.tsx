import React from 'react';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TrendDataPoint } from '@carbon/shared';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  dataPoints: TrendDataPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ dataPoints }) => {
  // Sort data points chronologically
  const sortedPoints = [...dataPoints].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedPoints.map((dp) => {
    const d = new Date(dp.date);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Carbon Emissions (kg CO₂e)',
        data: sortedPoints.map((dp) => dp.co2eKg),
        fill: true,
        borderColor: '#10b981', // var(--accent-emerald)
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: 'rgba(255, 255, 255, 0.2)',
        pointHoverBackgroundColor: '#0f1016',
        pointHoverBorderColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Custom header is cleaner
      },
      tooltip: {
        backgroundColor: '#0f1016',
        titleFont: { family: 'var(--font-heading)', size: 12 },
        bodyFont: { family: 'var(--font-sans)', size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8', // var(--text-secondary)
          font: { family: 'var(--font-sans)', size: 11 },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'var(--font-sans)', size: 11 },
        },
        border: {
          dash: [4, 4]
        }
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '260px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
