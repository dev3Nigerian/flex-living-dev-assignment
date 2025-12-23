import axios from 'axios';
import type {
  GoogleReview,
  GoogleReviewsResponse,
  HostawayResponse,
  ImportedGoogleReviewsResponse,
  PublicReviewsResponse,
  ReviewFilters,
  SelectionResponse,
  UpdateImportedGoogleReviewResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const buildHostawayParams = (filters?: Partial<ReviewFilters>) => {
  const params: Record<string, unknown> = {
    pageSize: 10,
  };

  if (!filters) {
    return params;
  }

  if (filters.channel && filters.channel !== 'all') {
    params.channel = filters.channel;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.minRating && filters.minRating > 0) {
    params.minRating = filters.minRating;
  }

  if (filters.maxRating && filters.maxRating < 5) {
    params.maxRating = filters.maxRating;
  }

  if (filters.dateRange?.start) {
    params.startDate = filters.dateRange.start;
  }

  if (filters.dateRange?.end) {
    params.endDate = filters.dateRange.end;
  }

  return params;
};

export const fetchHostawayReviews = async (filters?: Partial<ReviewFilters>) => {
  const { data } = await apiClient.get<HostawayResponse>('/api/reviews/hostaway', {
    params: buildHostawayParams(filters),
  });
  return data;
};

export const fetchSelection = async () => {
  const { data } = await apiClient.get<SelectionResponse>('/api/reviews/selection');
  return data;
};

export const updateSelection = async (selectedIds: number[]) => {
  const { data } = await apiClient.post<SelectionResponse>('/api/reviews/selection', { selectedIds });
  return data;
};

export const fetchGoogleReviews = async (listingId?: number) => {
  const { data } = await apiClient.get<GoogleReviewsResponse>('/api/reviews/google', {
    params: listingId ? { listingId } : undefined,
  });
  return data;
};

export const fetchImportedGoogleReviews = async (listingId?: number) => {
  const { data } = await apiClient.get<ImportedGoogleReviewsResponse>('/api/reviews/google/import', {
    params: listingId ? { listingId } : undefined,
  });
  return data;
};

export const importGoogleReviews = async (params: {
  listingId: number;
  placeId?: string;
  reviews: GoogleReview[];
}) => {
  const { data } = await apiClient.post<ImportedGoogleReviewsResponse>('/api/reviews/google/import', params);
  return data;
};

export const updateImportedGoogleReview = async (params: {
  listingId: number;
  reviewId: string;
  published: boolean;
}) => {
  const { data } = await apiClient.patch<UpdateImportedGoogleReviewResponse>('/api/reviews/google/import', params);
  return data;
};

export const fetchPublicReviews = async (listingId?: number) => {
  const { data } = await apiClient.get<PublicReviewsResponse>('/api/reviews/public', {
    params: listingId ? { listingId } : undefined,
  });
  return data;
};

