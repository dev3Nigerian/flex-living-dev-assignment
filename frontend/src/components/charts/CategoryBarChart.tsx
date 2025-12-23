import { Bar } from 'react-chartjs-2';
import type { PropertyPerformance } from '../../lib/types';

interface Props {
  property?: PropertyPerformance;
}

const CategoryBarChart = ({ property }: Props) => {
  if (!property || Object.keys(property.categoryAverages ?? {}).length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400">
        Select a property to view category performance.
      </div>
    );
  }

  const labels = Object.keys(property.categoryAverages);
  const values = Object.values(property.categoryAverages).map((value) => Number(value.toFixed(1)));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average score',
        data: values,
        backgroundColor: 'rgba(15,23,42,0.9)',
        borderRadius: 10,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Category health</h3>
        <p className="text-xs text-slate-400">{property.listingName}</p>
      </div>
      <div className="mt-4 h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryBarChart;

