import { CheckCircle2, Circle } from 'lucide-react';
import type { Review, ReviewId } from '../../lib/types';
import { formatDate, formatRating } from '../../utils/format';

interface ReviewSelectionListProps {
  reviews: Review[];
  selectedIds: Set<string>;
  onToggleHostaway: (reviewId: ReviewId) => void;
  onToggleGoogle?: (reviewId: string, publish: boolean) => void;
  isUpdating?: boolean;
}

const ReviewSelectionList = ({
  reviews,
  selectedIds,
  onToggleHostaway,
  onToggleGoogle,
  isUpdating = false,
}: ReviewSelectionListProps) => {
  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No reviews for this property in the selected window.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isGoogle = review.source === 'google';
        const isApproved = isGoogle ? Boolean(review.published) : selectedIds.has(String(review.id));
        return (
          <div key={review.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{review.guestName}</p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>
                    {formatDate(review.submittedAt)} · {review.channel}
                  </span>
                  {isGoogle && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                      Google
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-900">
                  {formatRating(review.normalizedRating)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    isGoogle
                      ? onToggleGoogle?.(String(review.id), !isApproved)
                      : onToggleHostaway(review.id)
                  }
                  disabled={isUpdating || (isGoogle && !onToggleGoogle)}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition"
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Published
                    </>
                  ) : (
                    <>
                      <Circle size={14} className="text-slate-400" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">{review.publicReview}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              {review.reviewCategory?.map((category) => (
                <span key={category.category} className="rounded-full bg-slate-50 px-3 py-1">
                  {category.category}: {category.rating}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewSelectionList;

