export type ReviewChannel = 'Airbnb' | 'Booking' | 'Direct' | 'VRBO' | 'Google';

export interface ReviewCategory {
  category: string;
  rating: number | null;
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'archived';
  rating: number | null; // Hostaway sometimes stores 10-point scale
  publicReview: string;
  privateFeedback?: string | null;
  reviewCategory: ReviewCategory[];
  submittedAt: string; // ISO string
  guestName: string;
  listingName: string;
  listingId: number;
  channel?: ReviewChannel;
}

export interface NormalizedReview extends HostawayReview {
  normalizedRating: number | null; // 1-5 scale
  stayDate: string;
}

export interface CategoryAverages {
  [category: string]: number;
}

export interface ChannelSummary {
  channel: ReviewChannel;
  total: number;
  averageRating: number | null;
}

export interface KeywordInsight {
  keyword: string;
  occurrences: number;
}

export interface TrendPoint {
  month: string;
  averageRating: number | null;
  reviewCount: number;
}

export interface PropertyPerformance {
  listingId: number;
  listingName: string;
  totalReviews: number;
  overallAverage: number | null;
  categoryAverages: CategoryAverages;
  channelBreakdown: ChannelSummary[];
  latestReviewDate: string | null;
  reviews: NormalizedReview[];
  alerts: string[];
  flaggedReviewIds: number[];
}

export interface HostawaySummaryPayload {
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

export interface GoogleReviewEntry {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  profilePhotoUrl?: string;
  publishedAt?: string;
  language?: string;
}

export interface GoogleReviewMetadata {
  placeId: string;
  placeName: string;
  userRatingsTotal: number;
  averageRating: number | null;
  lastSynced: string;
  listingId?: string | null;
}

export interface GoogleReviewPayload {
  reviews: GoogleReviewEntry[];
  metadata: GoogleReviewMetadata;
}

export interface StoredGoogleReview extends GoogleReviewEntry {
  listingId: number;
  placeId: string;
  published: boolean;
  importedAt: string;
}

export interface GoogleImportStore {
  byListing: Record<string, StoredGoogleReview[]>;
}

