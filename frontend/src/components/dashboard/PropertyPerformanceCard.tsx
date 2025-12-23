import clsx from 'clsx';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PropertyPerformance } from '../../lib/types';
import { compactNumber, formatRating } from '../../utils/format';

interface PropertyPerformanceCardProps {
  property: PropertyPerformance;
  isSelected: boolean;
  onSelect: (listingId: number) => void;
}

const PropertyPerformanceCard = ({ property, isSelected, onSelect }: PropertyPerformanceCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(property.listingId)}
      className={clsx(
        'flex w-full flex-col rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1',
        isSelected ? 'border-slate-900' : 'border-slate-200',
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Listing</p>
          <p className="text-lg font-semibold text-slate-900">{property.listingName}</p>
        </div>
        <Link
          to={`/property/${property.listingId}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900"
          onClick={(event) => event.stopPropagation()}
        >
          View page
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg rating</p>
          <p className="text-2xl font-semibold text-slate-900">{formatRating(property.overallAverage)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Reviews</p>
          <p className="text-2xl font-semibold text-slate-900">{compactNumber(property.totalReviews)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {property.channelBreakdown.map((channel) => (
          <span key={channel.channel} className="rounded-full bg-slate-100 px-3 py-1">
            {channel.channel}: {channel.total}
          </span>
        ))}
      </div>
      {property.alerts.length > 0 && (
        <div className="mt-4 space-y-2 text-xs text-amber-600">
          {property.alerts.map((alert) => (
            <p key={alert} className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2">
              <AlertTriangle size={14} />
              {alert}
            </p>
          ))}
        </div>
      )}
    </button>
  );
};

export default PropertyPerformanceCard;

