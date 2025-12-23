import cors from 'cors';
import express, { Request, Response } from 'express';
import { HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY, GOOGLE_PLACES_API_KEY } from './config';
import { mockReviews } from './data/mockReviews';
import {
  buildHostawayPayload,
  normalizeReviewRecord,
} from './utils/reviewAggregator';
import { readSelection, writeSelection } from './utils/selectionStore';
import { HostawayReview } from './types';
import { fetchGoogleReviewsForPlace, resolvePlaceId } from './utils/googleReviews';
import { mockGoogleReviews } from './data/mockGoogleReviews';
import {
  getImportedGoogleReviews,
  importGoogleReviews,
  updateGoogleReviewPublishState,
} from './utils/googleImportStore';

const listingNameLookup = new Map<number, string>();
mockReviews.forEach((review) => {
  if (!listingNameLookup.has(review.listingId)) {
    listingNameLookup.set(review.listingId, review.listingName);
  }
});

const app = express();

app.use(cors());
app.use(express.json());

const toSafeNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    const [first] = value;
    if (typeof first === 'string') {
      return first;
    }
  }
  return undefined;
};

const filterReviews = (
  reviews: HostawayReview[],
  query: Record<string, unknown>,
): HostawayReview[] => {
  let filtered = [...reviews];

  if (query.listingId) {
    const id = Number(query.listingId);
    if (!Number.isNaN(id)) {
      filtered = filtered.filter((review) => review.listingId === id);
    }
  }

  if (query.channel) {
    const channels = (Array.isArray(query.channel) ? query.channel : [query.channel]).map((channel) =>
      String(channel).toLowerCase(),
    );
    filtered = filtered.filter((review) => channels.includes((review.channel ?? 'direct').toLowerCase()));
  }

  if (query.status) {
    const statusValue = String(query.status).toLowerCase();
    filtered = filtered.filter((review) => review.status.toLowerCase() === statusValue);
  }

  if (query.startDate) {
    const start = new Date(String(query.startDate));
    filtered = filtered.filter((review) => new Date(review.submittedAt) >= start);
  }

  if (query.endDate) {
    const end = new Date(String(query.endDate));
    filtered = filtered.filter((review) => new Date(review.submittedAt) <= end);
  }

  const minRating = query.minRating ? Number(query.minRating) : null;
  const maxRating = query.maxRating ? Number(query.maxRating) : null;

  if (minRating !== null || maxRating !== null) {
    filtered = filtered.filter((review) => {
      if (review.rating === null) return false;
      const normalized = review.rating / 2;
      if (minRating !== null && normalized < minRating) return false;
      if (maxRating !== null && normalized > maxRating) return false;
      return true;
    });
  }

  if (query.search) {
    const term = String(query.search).toLowerCase();
    filtered = filtered.filter((review) => {
      const haystack = `${review.publicReview} ${review.guestName} ${review.listingName}`.toLowerCase();
      return haystack.includes(term);
    });
  }

  return filtered;
};

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'flex-reviews-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/reviews/hostaway', (req: Request, res: Response) => {
  const page = toSafeNumber(req.query.page, 1);
  const pageSize = toSafeNumber(req.query.pageSize, 5);
  const filteredReviews = filterReviews(mockReviews, req.query as Record<string, unknown>);

  const payload = buildHostawayPayload(filteredReviews, page, pageSize);

  res.json({
    status: 'success',
    source: {
      accountId: HOSTAWAY_ACCOUNT_ID,
      apiKeyLastFour: HOSTAWAY_API_KEY?.slice(-4),
    },
    appliedFilters: req.query,
    data: payload,
  });
});

app.get('/api/reviews/google', async (req: Request, res: Response) => {
  const listingIdParam = toOptionalString(req.query.listingId);
  const explicitPlaceId = toOptionalString(req.query.placeId);

  if (!GOOGLE_PLACES_API_KEY) {
    return res.json({
      status: 'mocked',
      metadata: {
        total: mockGoogleReviews.length,
        lastSynced: new Date().toISOString(),
      },
      reviews: mockGoogleReviews,
      notes: 'Set GOOGLE_PLACES_API_KEY in backend/.env to enable live data.',
    });
  }

  const placeId = resolvePlaceId(listingIdParam, explicitPlaceId);

  if (!placeId) {
    return res.status(400).json({
      status: 'error',
      message:
        'No Google Place ID configured. Pass ?placeId=YOUR_ID or define GOOGLE_PLACE_ID_<listingId> in backend/.env.',
    });
  }

  try {
    const payload = await fetchGoogleReviewsForPlace(placeId, listingIdParam);
    res.json({
      status: 'success',
      metadata: payload.metadata,
      reviews: payload.reviews,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch Google reviews', error);
    res.status(502).json({
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Unable to fetch Google reviews. Verify API key and Place ID configuration.',
      fallback: {
        total: mockGoogleReviews.length,
        reviews: mockGoogleReviews,
      },
    });
  }
});

app.get('/api/reviews/google/import', async (req: Request, res: Response) => {
  const listingId = req.query.listingId ? Number(req.query.listingId) : undefined;
  const reviews = await getImportedGoogleReviews(Number.isFinite(listingId) ? listingId : undefined);
  res.json({
    status: 'success',
    reviews,
  });
});

app.post('/api/reviews/google/import', async (req: Request, res: Response) => {
  const listingId = Number(req.body?.listingId);
  const reviews = Array.isArray(req.body?.reviews) ? req.body.reviews : [];
  const placeIdInput = typeof req.body?.placeId === 'string' ? req.body.placeId : undefined;

  if (!Number.isFinite(listingId) || !reviews.length) {
    return res.status(400).json({
      status: 'error',
      message: 'Provide listingId and an array of reviews to import.',
    });
  }

  const placeId = resolvePlaceId(String(listingId), placeIdInput);
  if (!placeId) {
    return res.status(400).json({
      status: 'error',
      message: 'Unable to resolve Google Place ID for this listing.',
    });
  }

  const stored = await importGoogleReviews({
    listingId,
    placeId,
    reviews,
  });

  res.json({
    status: 'success',
    reviews: stored,
  });
});

app.patch('/api/reviews/google/import', async (req: Request, res: Response) => {
  const listingId = Number(req.body?.listingId);
  const reviewId = typeof req.body?.reviewId === 'string' ? req.body.reviewId : undefined;
  const published = typeof req.body?.published === 'boolean' ? req.body.published : undefined;

  if (!Number.isFinite(listingId) || !reviewId || typeof published !== 'boolean') {
    return res.status(400).json({
      status: 'error',
      message: 'listingId, reviewId, and published (boolean) are required.',
    });
  }

  const updated = await updateGoogleReviewPublishState({
    listingId,
    reviewId,
    published,
  });

  if (!updated) {
    return res.status(404).json({
      status: 'error',
      message: 'Review not found.',
    });
  }

  res.json({
    status: 'success',
    review: updated,
  });
});

app.get('/api/reviews/selection', async (_req: Request, res: Response) => {
  const selectedIds = await readSelection();
  res.json({
    status: 'success',
    selectedIds,
  });
});

app.post('/api/reviews/selection', async (req: Request, res: Response) => {
  const selectedIds = Array.isArray(req.body?.selectedIds)
    ? req.body.selectedIds
    : Array.isArray(req.body?.reviewIds)
      ? req.body.reviewIds
      : null;

  if (!selectedIds) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a selectedIds array in the request body.',
    });
  }

  const numericIds = selectedIds.map(Number).filter((value: number) => Number.isFinite(value));
  await writeSelection(numericIds);
  res.json({
    status: 'success',
    selectedIds: numericIds,
  });
});

app.get('/api/reviews/public', async (req: Request, res: Response) => {
  const selectedIds = await readSelection();
  const requestedListingId = req.query.listingId ? Number(req.query.listingId) : null;

  const reviews = mockReviews
    .filter((review) => selectedIds.includes(review.id))
    .filter((review) => (requestedListingId ? review.listingId === requestedListingId : true))
    .filter((review) => review.status === 'published')
    .map((review) => ({
      ...normalizeReviewRecord(review),
    }));

  const importedGoogle = await getImportedGoogleReviews(requestedListingId ?? undefined);
  const googlePublished = importedGoogle.filter((review) => review.published);
  const googleReviews = googlePublished.map((review) => ({
    id: review.id,
    type: 'guest-to-host',
    status: 'published' as const,
    rating: review.rating * 2,
    publicReview: review.text,
    reviewCategory: [],
    submittedAt: review.publishedAt ?? review.importedAt,
    stayDate: review.publishedAt ?? review.importedAt,
    guestName: review.authorName,
    listingName: listingNameLookup.get(review.listingId) ?? `Listing ${review.listingId}`,
    listingId: review.listingId,
    channel: 'Google',
    normalizedRating: review.rating,
  }));

  res.json({
    status: 'success',
    count: reviews.length + googleReviews.length,
    reviews: [...reviews, ...googleReviews],
  });
});

export default app;

