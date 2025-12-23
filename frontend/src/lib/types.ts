export interface ReviewCategory {
  category: string;
  rating: number | null;
}

export type ReviewId = number | string;

export interface Review {
  id: ReviewId;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  privateFeedback?: string | null;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  stayDate: string;
  guestName: string;
  listingName: string;
  listingId: number;
  channel?: string;
  normalizedRating: number | null;
  source?: 'hostaway' | 'google';
  published?: boolean;
}

export interface ChannelSummary {
  channel: string;
  total: number;
  averageRating: number | null;
}

export interface PropertyPerformance {
  listingId: number;
  listingName: string;
  totalReviews: number;
  overallAverage: number | null;
  categoryAverages: Record<string, number>;
  channelBreakdown: ChannelSummary[];
  latestReviewDate: string | null;
  reviews: Review[];
  alerts: string[];
  flaggedReviewIds: number[];
}

export interface TrendPoint {
  month: string;
  averageRating: number | null;
  reviewCount: number;
}

export interface KeywordInsight {
  keyword: string;
  occurrences: number;
}

export interface HostawaySummary {
  properties: PropertyPerformance[];
  summary: {
    totalProperties: number;
    totalReviews: number;
    globalAverage: number | null;
    trending: TrendPoint[];
    recurringKeywords: KeywordInsight[];
  };
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface HostawayResponse {
  status: string;
  data: HostawaySummary;
  appliedFilters: Record<string, unknown>;
}

export interface SelectionResponse {
  status: string;
  selectedIds: number[];
}

export interface GoogleReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  profilePhotoUrl?: string;
  publishedAt?: string;
}

export interface GoogleReviewsResponse {
  status: string;
  reviews: GoogleReview[];
  metadata: {
    placeId: string;
    placeName: string;
    userRatingsTotal: number;
    averageRating: number | null;
    lastSynced: string;
    listingId?: string | null;
  };
  notes?: string;
}

export interface ImportedGoogleReview {
  id: string;
  listingId: number;
  placeId: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  profilePhotoUrl?: string;
  published: boolean;
  importedAt: string;
  publishedAt?: string;
}

export interface ImportedGoogleReviewsResponse {
  status: string;
  reviews: ImportedGoogleReview[];
}

export interface UpdateImportedGoogleReviewResponse {
  status: string;
  review: ImportedGoogleReview;
}

export interface PublicReviewsResponse {
  status: string;
  count: number;
  reviews: Review[];
}

export interface ReviewFilters {
  channel: string;
  minRating: number;
  maxRating: number;
  dateRange: { start?: string; end?: string };
  search: string;
}

