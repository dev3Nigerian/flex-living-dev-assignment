import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '../config';
import { propertyPlaceIds } from '../data/googlePlaces';
import { GoogleReviewEntry, GoogleReviewPayload } from '../types';

const GOOGLE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const reviewCache = new Map<string, { payload: GoogleReviewPayload; expiresAt: number }>();

const getEnvOverrideForListing = (listingId: string) => process.env[`GOOGLE_PLACE_ID_${listingId}`];

export const resolvePlaceId = (listingId?: string | number, explicit?: string | null): string | null => {
  if (explicit) return explicit;
  const normalized = typeof listingId === 'number' ? String(listingId) : listingId;
  if (normalized) {
    const envOverride = getEnvOverrideForListing(normalized);
    if (envOverride) return envOverride;
    const mapped = propertyPlaceIds[Number(normalized)];
    if (mapped) return mapped;
  }
  return process.env.GOOGLE_PLACE_ID_DEFAULT ?? propertyPlaceIds[253093] ?? null;
};

const normalizeGoogleReviews = (reviews: any[] = []): GoogleReviewEntry[] =>
  reviews.map((review) => {
    const normalized: GoogleReviewEntry = {
      id: `${review.author_name ?? 'anon'}-${review.time ?? Date.now()}`,
      authorName: review.author_name ?? 'Anonymous guest',
      rating: review.rating ?? 0,
      text: review.text ?? '',
    };

    if (review.relative_time_description) {
      normalized.relativeTimeDescription = review.relative_time_description;
    }
    if (review.profile_photo_url) {
      normalized.profilePhotoUrl = review.profile_photo_url;
    }
    if (review.time) {
      normalized.publishedAt = new Date(review.time * 1000).toISOString();
    }
    if (review.language) {
      normalized.language = review.language;
    }

    return normalized;
  });

export const fetchGoogleReviewsForPlace = async (
  placeId: string,
  listingId?: string,
): Promise<GoogleReviewPayload> => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Missing Google Places API key');
  }

  const cached = reviewCache.get(placeId);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.payload;
  }

  const { data } = await axios.get(GOOGLE_DETAILS_URL, {
    params: {
      place_id: placeId,
      fields: 'name,rating,user_ratings_total,reviews',
      key: GOOGLE_PLACES_API_KEY,
    },
  });

  if (data.status !== 'OK') {
    throw new Error(data.error_message ?? `Google Places returned status ${data.status}`);
  }

  const reviews = normalizeGoogleReviews(data.result?.reviews);
  const payload: GoogleReviewPayload = {
    reviews,
    metadata: {
      placeId,
      placeName: data.result?.name ?? 'Google Places location',
      userRatingsTotal: data.result?.user_ratings_total ?? reviews.length,
      averageRating: data.result?.rating ?? null,
      lastSynced: new Date(now).toISOString(),
      listingId: listingId ?? null,
    },
  };

  reviewCache.set(placeId, { payload, expiresAt: now + CACHE_TTL_MS });
  return payload;
};

