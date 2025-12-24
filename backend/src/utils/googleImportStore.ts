import { promises as fs } from 'fs';
import path from 'path';
import { GoogleImportStore, StoredGoogleReview, GoogleReviewEntry } from '../types';

const STORAGE_DIR =
  process.env.GOOGLE_IMPORT_STORE_PATH ??
  (process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), 'storage'));
const STORAGE_PATH = path.join(STORAGE_DIR, 'googleImported.json');

const ensureStoreFile = async (): Promise<void> => {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.access(STORAGE_PATH);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const initial: GoogleImportStore = { byListing: {} };
      await fs.writeFile(STORAGE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return;
    }
    throw error;
  }
};

const readStore = async (): Promise<GoogleImportStore> => {
  await ensureStoreFile();
  const raw = await fs.readFile(STORAGE_PATH, 'utf-8');
  return JSON.parse(raw) as GoogleImportStore;
};

const writeStore = async (store: GoogleImportStore) => {
  await ensureStoreFile();
  await fs.writeFile(STORAGE_PATH, JSON.stringify(store, null, 2), 'utf-8');
};

export const getImportedGoogleReviews = async (listingId?: number): Promise<StoredGoogleReview[]> => {
  const store = await readStore();
  if (listingId) {
    return store.byListing[String(listingId)] ?? [];
  }
  return Object.values(store.byListing).flat();
};

interface ImportPayload extends GoogleReviewEntry {
  placeId: string;
}

export const importGoogleReviews = async ({
  listingId,
  placeId,
  reviews,
}: {
  listingId: number;
  placeId: string;
  reviews: GoogleReviewEntry[];
}): Promise<StoredGoogleReview[]> => {
  const store = await readStore();
  const listingKey = String(listingId);
  const existing = store.byListing[listingKey] ?? [];

  const now = new Date().toISOString();
  const deduped = [...existing];

  reviews.forEach((review) => {
    const alreadyExists = deduped.some((item) => item.id === review.id);
    if (!alreadyExists) {
      const entry: StoredGoogleReview = {
        ...review,
        listingId,
        placeId,
        published: false,
        importedAt: now,
      };
      deduped.push(entry);
    }
  });

  store.byListing[listingKey] = deduped;
  await writeStore(store);
  return deduped;
};

export const updateGoogleReviewPublishState = async ({
  listingId,
  reviewId,
  published,
}: {
  listingId: number;
  reviewId: string;
  published: boolean;
}): Promise<StoredGoogleReview | null> => {
  const store = await readStore();
  const listingKey = String(listingId);
  const reviews = store.byListing[listingKey];
  if (!reviews) return null;
  const review = reviews.find((entry) => entry.id === reviewId);
  if (!review) return null;
  review.published = published;
  await writeStore(store);
  return review;
};

