import dayjs from 'dayjs';
import {
  CategoryAverages,
  ChannelSummary,
  HostawayReview,
  HostawaySummaryPayload,
  KeywordInsight,
  NormalizedReview,
  PropertyPerformance,
  ReviewChannel,
  TrendPoint,
} from '../types';

const KEYWORD_DICTIONARY: Array<{ label: string; patterns: string[] }> = [
  { label: 'cleanliness', patterns: ['clean', 'dust', 'dirty'] },
  { label: 'noise', patterns: ['noise', 'noisy', 'loud'] },
  { label: 'wifi', patterns: ['wifi', 'internet'] },
  { label: 'check-in', patterns: ['check-in', 'checkin', 'check in'] },
  { label: 'heating', patterns: ['heat', 'heating', 'boiler'] },
  { label: 'location', patterns: ['location', 'neighborhood', 'area'] },
  { label: 'amenities', patterns: ['amenities', 'appliance', 'kitchen', 'desk'] },
  { label: 'comfort', patterns: ['comfortable', 'comfy', 'bed', 'sofa'] },
  { label: 'staff', patterns: ['host', 'team', 'staff', 'concierge'] },
];

const roundTo = (value: number, decimals = 2): number => parseFloat(value.toFixed(decimals));

const average = (values: number[]): number | null => {
  if (!values.length) return null;
  return roundTo(values.reduce((sum, value) => sum + value, 0) / values.length);
};

export const normalizeReviewRecord = (review: HostawayReview): NormalizedReview => {
  const cappedRating = review.rating === null ? null : Math.min(Math.max(review.rating, 0), 10);
  const normalizedRating = cappedRating === null ? null : roundTo(cappedRating / 2, 2);
  return {
    ...review,
    normalizedRating,
    stayDate: review.submittedAt,
    channel: review.channel ?? 'Direct',
  };
};

const aggregateCategories = (reviews: NormalizedReview[]): CategoryAverages => {
  const scores: Record<string, number[]> = {};
  reviews.forEach((review) => {
    review.reviewCategory.forEach((category) => {
      if (category.rating === null) return;
      const key = category.category;
      if (!scores[key]) scores[key] = [];
      scores[key]!.push(category.rating / 2);
    });
  });

  return Object.entries(scores).reduce<CategoryAverages>((acc, [category, values]) => {
    acc[category] = average(values) ?? 0;
    return acc;
  }, {});
};

const buildChannelBreakdown = (reviews: NormalizedReview[]): ChannelSummary[] => {
  const channelMap: Record<
    string,
    {
      total: number;
      ratings: number[];
    }
  > = {};

  reviews.forEach((review) => {
    const key = review.channel ?? 'Direct';
    if (!channelMap[key]) {
      channelMap[key] = { total: 0, ratings: [] };
    }
    const bucket = channelMap[key]!;
    bucket.total += 1;
    if (review.normalizedRating !== null) {
      bucket.ratings.push(review.normalizedRating);
    }
  });

  const breakdown: ChannelSummary[] = Object.entries(channelMap).map(([channel, data]) => ({
    channel: channel as ReviewChannel,
    total: data.total,
    averageRating: average(data.ratings),
  }));

  return breakdown;
};

const buildTrend = (reviews: NormalizedReview[]): TrendPoint[] => {
  const trendMap: Record<
    string,
    {
      ratings: number[];
      reviewCount: number;
    }
  > = {};

  reviews.forEach((review) => {
    const monthKey = dayjs(review.submittedAt).format('YYYY-MM');
    if (!trendMap[monthKey]) {
      trendMap[monthKey] = { ratings: [], reviewCount: 0 };
    }
    trendMap[monthKey].reviewCount += 1;
    if (review.normalizedRating !== null) {
      trendMap[monthKey].ratings.push(review.normalizedRating);
    }
  });

  return Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map<TrendPoint>(([month, data]) => ({
      month,
      reviewCount: data.reviewCount,
      averageRating: average(data.ratings),
    }));
};

const extractKeywords = (reviews: NormalizedReview[]): KeywordInsight[] => {
  const keywordCounts: Record<string, number> = {};

  reviews.forEach((review) => {
    const text = review.publicReview.toLowerCase();
    KEYWORD_DICTIONARY.forEach((keyword) => {
      if (keyword.patterns.some((pattern) => text.includes(pattern))) {
        keywordCounts[keyword.label] = (keywordCounts[keyword.label] ?? 0) + 1;
      }
    });
  });

  return Object.entries(keywordCounts)
    .map<KeywordInsight>(([keyword, occurrences]) => ({ keyword, occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 6);
};

export const buildHostawayPayload = (
  rawReviews: HostawayReview[],
  page = 1,
  pageSize = 5,
): HostawaySummaryPayload => {
  const normalizedReviews = rawReviews.map(normalizeReviewRecord);
  const grouped = normalizedReviews.reduce<Record<number, NormalizedReview[]>>((acc, review) => {
    if (!acc[review.listingId]) {
      acc[review.listingId] = [];
    }
    acc[review.listingId]!.push(review);
    return acc;
  }, {});

  const propertySummaries = Object.values(grouped).map<PropertyPerformance>((reviews) => {
    const [first] = reviews;
    if (!first) {
      throw new Error('Unexpected empty review group');
    }
    const normalizedRatings = reviews
      .map((review) => review.normalizedRating)
      .filter((rating): rating is number => rating !== null);
    const overallAverage = average(normalizedRatings);
    const categoryAverages = aggregateCategories(reviews);
    const channelBreakdown = buildChannelBreakdown(reviews);
    const latestReviewDate = reviews
      .map((review) => review.submittedAt)
      .sort((a, b) => dayjs(b).valueOf() - dayjs(a).valueOf())[0] ?? null;

    const flaggedReviewIds = reviews
      .filter((review) => review.normalizedRating !== null && review.normalizedRating < 3)
      .map((review) => review.id);

    const alerts: string[] = [];
    if (overallAverage !== null && overallAverage < 3.5) {
      alerts.push('Overall rating trending low');
    }
    if (flaggedReviewIds.length > 0) {
      alerts.push(`${flaggedReviewIds.length} review(s) flagged for follow-up`);
    }

    return {
      listingId: first.listingId,
      listingName: first.listingName,
      totalReviews: reviews.length,
      overallAverage,
      categoryAverages,
      channelBreakdown,
      latestReviewDate,
      reviews: reviews.sort((a, b) => dayjs(b.submittedAt).valueOf() - dayjs(a.submittedAt).valueOf()),
      alerts,
      flaggedReviewIds,
    };
  });

  propertySummaries.sort((a, b) => (dayjs(b.latestReviewDate).valueOf() - dayjs(a.latestReviewDate).valueOf()));

  const totalProperties = propertySummaries.length;
  const totalPages = Math.max(1, Math.ceil(totalProperties / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedProperties = propertySummaries.slice(start, start + pageSize);

  const globalAverage = average(
    normalizedReviews
      .map((review) => review.normalizedRating)
      .filter((rating): rating is number => rating !== null),
  );

  return {
    properties: paginatedProperties,
    summary: {
      totalProperties,
      totalReviews: normalizedReviews.length,
      globalAverage,
      trending: buildTrend(normalizedReviews),
      recurringKeywords: extractKeywords(normalizedReviews),
    },
    pagination: {
      page: currentPage,
      pageSize,
      totalPages,
    },
  };
};

