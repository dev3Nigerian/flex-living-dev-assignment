import { useMemo, useState } from 'react';
import { ArrowDownToLine, RefreshCcw } from 'lucide-react';
import type { GoogleReview, GoogleReviewsResponse } from '../../lib/types';

interface GoogleReviewsCardProps {
  reviews: GoogleReview[];
  metadata?: GoogleReviewsResponse['metadata'];
  onRefresh: () => void;
  onImport: (reviews: GoogleReview[]) => void;
  importedIds?: Set<string>;
  isLoading?: boolean;
  isImporting?: boolean;
}

const GoogleReviewsCard = ({
  reviews,
  metadata,
  onRefresh,
  onImport,
  importedIds,
  isLoading,
  isImporting,
}: GoogleReviewsCardProps) => {
  const lastSyncedLabel = metadata?.lastSynced ? new Date(metadata.lastSynced).toLocaleString() : 'Never';
  const headerSubtitle = metadata?.placeName
    ? `${metadata.placeName} · ${metadata.userRatingsTotal} reviews`
    : 'Connect your Google Place ID';

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedReviews = useMemo(
    () => reviews.filter((review) => selectedIds.has(review.id)),
    [reviews, selectedIds],
  );

  const handleImport = () => {
    if (!selectedReviews.length || isImporting) return;
    onImport(selectedReviews);
    setSelectedIds(new Set());
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Google Reviews</p>
          <h3 className="text-base font-semibold text-slate-900">Signal check</h3>
          <p className="text-xs text-slate-400">{headerSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
        >
          <RefreshCcw size={14} />
          Sync
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Last synced: {lastSyncedLabel}</p>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        {reviews.slice(0, 3).map((review) => {
          const alreadyImported = importedIds?.has(review.id);
          return (
            <label
              key={review.id}
              className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
              title={alreadyImported ? 'Already imported' : undefined}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                checked={selectedIds.has(review.id)}
                onChange={() => toggleSelection(review.id)}
                disabled={alreadyImported}
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {review.authorName}{' '}
                  <span className="text-xs font-normal text-amber-500">{'★'.repeat(review.rating)}</span>
                </p>
                <p>{review.text}</p>
                {review.relativeTimeDescription && (
                  <p className="text-xs text-slate-400">{review.relativeTimeDescription}</p>
                )}
              </div>
              {alreadyImported && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Imported
                </span>
              )}
            </label>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleImport}
        disabled={!selectedReviews.length || isImporting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        <ArrowDownToLine size={16} />
        {isImporting ? 'Importing…' : 'Import to dashboard'}
      </button>
    </section>
  );
};

export default GoogleReviewsCard;

