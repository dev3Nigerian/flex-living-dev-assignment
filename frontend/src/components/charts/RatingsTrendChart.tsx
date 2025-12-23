import { format } from 'date-fns';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TrendPoint } from '../../lib/types';

interface RatingsTrendChartProps {
  data: TrendPoint[];
}

const RatingsTrendChart = ({ data }: RatingsTrendChartProps) => {
  const labels = data.map((item) => {
    const [year, month] = item.month.split('-').map(Number);
    const date = new Date(year, (month ?? 1) - 1, 1);
    return format(date, 'MMM yy');
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average rating',
        data: data.map((item) => item.averageRating ?? null),
        borderColor: '#1d4ed8',
        backgroundColor: 'rgba(29,78,216,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const parsedValue =
              typeof tooltipItem.parsed === 'object'
                ? (tooltipItem.parsed as { y?: number }).y
                : (tooltipItem.parsed as number);
            const safeValue = Number(parsedValue ?? 0);
            return `${safeValue.toFixed(1)} ★`;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Ratings trend</h3>
        <p className="text-xs text-slate-400">Rolling 12 months</p>
      </div>
      <div className="mt-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RatingsTrendChart;

