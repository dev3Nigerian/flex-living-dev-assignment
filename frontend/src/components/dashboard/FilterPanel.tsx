import { Funnel } from 'lucide-react';
import type { ReviewFilters } from '../../lib/types';

interface FilterPanelProps {
  filters: ReviewFilters;
  onChange: <K extends keyof ReviewFilters>(key: K, value: ReviewFilters[K]) => void;
  onReset: () => void;
}

const channelOptions = ['all', 'Airbnb', 'Booking', 'Direct', 'VRBO'];

const FilterPanel = ({ filters, onChange, onReset }: FilterPanelProps) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Funnel size={18} />
          <span className="font-semibold">Filters</span>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Search guest or keyword
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Wifi, Alice Cooper..."
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Channel
          <select
            value={filters.channel}
            onChange={(event) => onChange('channel', event.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          >
            {channelOptions.map((channel) => (
              <option key={channel} value={channel}>
                {channel === 'all' ? 'All channels' : channel}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Min rating
          <input
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={filters.minRating}
            onChange={(event) => onChange('minRating', Number(event.target.value))}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Max rating
          <input
            type="number"
            min={filters.minRating}
            max={5}
            step={0.5}
            value={filters.maxRating}
            onChange={(event) => onChange('maxRating', Number(event.target.value))}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          From date
          <input
            type="date"
            value={filters.dateRange.start ?? ''}
            onChange={(event) =>
              onChange('dateRange', {
                ...filters.dateRange,
                start: event.target.value,
              })
            }
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          To date
          <input
            type="date"
            value={filters.dateRange.end ?? ''}
            onChange={(event) =>
              onChange('dateRange', {
                ...filters.dateRange,
                end: event.target.value,
              })
            }
            className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
};

export default FilterPanel;

