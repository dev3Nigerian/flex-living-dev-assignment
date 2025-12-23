import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppShell from '../components/layout/AppShell';
import FilterPanel from '../components/dashboard/FilterPanel';
import PropertyPerformanceCard from '../components/dashboard/PropertyPerformanceCard';
import RatingsTrendChart from '../components/charts/RatingsTrendChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import ReviewSelectionList from '../components/dashboard/ReviewSelectionList';
import KeywordChips from '../components/dashboard/KeywordChips';
import GoogleReviewsCard from '../components/dashboard/GoogleReviewsCard';
import StatTile from '../components/shared/StatTile';
import { useReviewFilters } from '../hooks/useReviewFilters';
import {
  fetchGoogleReviews,
  fetchHostawayReviews,
  fetchImportedGoogleReviews,
  importGoogleReviews,
  updateImportedGoogleReview,
} from '../lib/api';
import { useSelections } from '../hooks/useSelections';
import type { GoogleReviewsResponse } from '../lib/types';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { filters, updateFilter, resetFilters } = useReviewFilters();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const { selection, toggleSelection, isLoading: isSelectionLoading, isUpdating } = useSelections();

  const hostawayQuery = useQuery({
    queryKey: ['hostaway', filters],
    queryFn: () => fetchHostawayReviews(filters),
  });

  const properties = hostawayQuery.data?.data.properties ?? [];

  const selectedProperty =
    properties.find((property) => property.listingId === selectedPropertyId) ??
    (properties.length > 0 ? properties[0] : undefined);

  const activeListingId = selectedProperty?.listingId ?? properties[0]?.listingId ?? null;

  const googleQuery = useQuery({
    queryKey: ['google-reviews', activeListingId],
    queryFn: () => fetchGoogleReviews(activeListingId ?? undefined),
    enabled: Boolean(activeListingId),
  });

  const importedGoogleQuery = useQuery({
    queryKey: ['google-imported', activeListingId],
    queryFn: () => fetchImportedGoogleReviews(activeListingId ?? undefined),
    enabled: Boolean(activeListingId),
  });

  const importGoogleMutation = useMutation({
    mutationFn: ({
      listingId,
      placeId,
      reviews,
    }: {
      listingId: number;
      placeId?: string;
      reviews: GoogleReviewsResponse['reviews'];
    }) => importGoogleReviews({ listingId, placeId, reviews }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-imported', activeListingId] });
    },
  });

  const updateGooglePublishMutation = useMutation({
    mutationFn: (params: { listingId: number; reviewId: string; published: boolean }) =>
      updateImportedGoogleReview(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-imported', activeListingId] });
    },
  });

  const summary = hostawayQuery.data?.data.summary;

  useEffect(() => {
    if (!selectedPropertyId && properties.length) {
      setSelectedPropertyId(properties[0].listingId);
    }
  }, [properties, selectedPropertyId]);

  const flaggedCount = useMemo(
    () =>
      properties.reduce((total, property) => {
        return total + property.flaggedReviewIds.length;
      }, 0),
    [properties],
  );

  const selectedReviewIds = new Set((selection?.selectedIds ?? []).map((id) => id.toString()));
  const importedReviewIds = useMemo(
    () => new Set((importedGoogleQuery.data?.reviews ?? []).map((review) => review.id)),
    [importedGoogleQuery.data],
  );

  const googleImportedReviews = (importedGoogleQuery.data?.reviews ?? []).map((review) => ({
    id: review.id,
    type: 'guest-to-host',
    status: review.published ? 'published' : 'pending',
    rating: review.rating * 2,
    normalizedRating: review.rating,
    publicReview: review.text,
    reviewCategory: [],
    submittedAt: review.publishedAt ?? review.importedAt,
    stayDate: review.publishedAt ?? review.importedAt,
    guestName: review.authorName,
    listingName: selectedProperty?.listingName ?? `Listing ${review.listingId}`,
    listingId: review.listingId,
    channel: 'Google',
    source: 'google' as const,
    published: review.published,
    relativeTimeDescription: review.relativeTimeDescription,
  }));

  const hostawayReviews =
    selectedProperty?.reviews.map((review) => ({
      ...review,
      source: 'hostaway' as const,
    })) ?? [];

  const combinedReviews = [...hostawayReviews, ...googleImportedReviews];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile label="Portfolio average" value={`${summary?.globalAverage?.toFixed(1) ?? '—'} ★`} />
          <StatTile label="Total reviews" value={`${summary?.totalReviews ?? 0}`} helper="Rolling 12 months" />
          <StatTile
            label="Flagged items"
            value={`${flaggedCount}`}
            helper="Auto-detected issues"
            variant={flaggedCount > 0 ? 'warning' : 'default'}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400">Recurring themes</p>
            <h3 className="text-base font-semibold text-slate-900">What guests mention most</h3>
            <div className="mt-3">
              <KeywordChips keywords={summary?.recurringKeywords ?? []} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RatingsTrendChart data={summary?.trending ?? []} />
          <CategoryBarChart property={selectedProperty} />
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            {hostawayQuery.isLoading && <p>Loading performance…</p>}
            {!hostawayQuery.isLoading &&
              properties.map((property) => (
                <PropertyPerformanceCard
                  key={property.listingId}
                  property={property}
                  isSelected={property.listingId === selectedProperty?.listingId}
                  onSelect={(listingId) => setSelectedPropertyId(listingId)}
                />
              ))}
            {!hostawayQuery.isLoading && properties.length === 0 && (
              <p className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No reviews match the selected filters. Try widening the date range.
              </p>
            )}
          </div>
          <div className="space-y-4">
            <GoogleReviewsCard
              reviews={googleQuery.data?.reviews ?? []}
              metadata={googleQuery.data?.metadata}
              isLoading={googleQuery.isFetching}
              isImporting={importGoogleMutation.isPending}
              importedIds={importedReviewIds}
              onRefresh={() => googleQuery.refetch()}
              onImport={(reviewsToImport) => {
                if (!activeListingId) return;
                importGoogleMutation.mutate({
                  listingId: activeListingId,
                  placeId: googleQuery.data?.metadata.placeId,
                  reviews: reviewsToImport,
                });
              }}
            />
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" id="reviews">
              <p className="text-xs uppercase tracking-widest text-slate-400">Publishing queue</p>
              <h3 className="text-base font-semibold text-slate-900">Approved for property page</h3>
              <p className="text-sm text-slate-500">
                Toggle any review below to control what appears on the public Guest Reviews section.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedProperty?.listingName ?? 'Select a property'} · Guest reviews
          </h3>
          <ReviewSelectionList
            reviews={combinedReviews}
            selectedIds={selectedReviewIds}
            onToggleHostaway={(reviewId) => {
              if (typeof reviewId !== 'number') return;
              toggleSelection(reviewId);
            }}
            onToggleGoogle={(reviewId, publish) => {
              if (!activeListingId) return;
              updateGooglePublishMutation.mutate({
                listingId: activeListingId,
                reviewId,
                published: publish,
              });
            }}
            isUpdating={isUpdating || isSelectionLoading || updateGooglePublishMutation.isPending}
          />
        </section>
      </div>
    </AppShell>
  );
};

export default DashboardPage;

