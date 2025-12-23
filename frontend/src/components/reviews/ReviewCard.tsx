import { Star } from 'lucide-react';
import type { Review } from '../../lib/types';
import { formatDate, formatRating } from '../../utils/format';

const ReviewCard = ({ review }: { review: Review }) => {
  const isGoogle = review.channel?.toLowerCase() === 'google';
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.guestName}</p>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>{formatDate(review.submittedAt)}</span>
            {isGoogle && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                Google
              </span>
            )}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-sm font-semibold text-white">
          <Star size={14} className="text-amber-400" />
          {formatRating(review.normalizedRating)}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-700">{review.publicReview}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {review.reviewCategory?.map((category) => (
          <span key={category.category} className="rounded-full bg-slate-50 px-3 py-1">
            {category.category}: {category.rating}
          </span>
        ))}
      </div>
    </article>
  );
};

export default ReviewCard;

