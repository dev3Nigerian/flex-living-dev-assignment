import type { KeywordInsight } from '../../lib/types';

const KeywordChips = ({ keywords }: { keywords: KeywordInsight[] }) => {
  if (!keywords.length) {
    return <p className="text-sm text-slate-500">No recurring themes detected.</p>;
  }

  const maxOccurrences = Math.max(...keywords.map((keyword) => keyword.occurrences), 1);

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => {
        const weight = keyword.occurrences / maxOccurrences;
        const size = 0.85 + weight * 0.6;
        return (
          <span
            key={keyword.keyword}
            style={{ fontSize: `${size}rem` }}
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
          >
            {keyword.keyword} ({keyword.occurrences})
          </span>
        );
      })}
    </div>
  );
};

export default KeywordChips;

