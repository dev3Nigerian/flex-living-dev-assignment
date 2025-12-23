import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bath, BedDouble, Layers, MapPin, Star, Users } from 'lucide-react';
import { fetchPublicReviews } from '../lib/api';
import { propertyContent } from '../data/propertyContent';
import ReviewCard from '../components/reviews/ReviewCard';

const PropertyPage = () => {
  const { id = '253093' } = useParams();
  const content = propertyContent[id] ?? propertyContent['253093'];

  const reviewsQuery = useQuery({
    queryKey: ['public-reviews', id],
    queryFn: () => fetchPublicReviews(Number(id)),
    staleTime: 1000 * 60,
  });

  const galleryImages = useMemo(() => {
    if (content.heroImages.length >= 5) {
      return content.heroImages.slice(0, 5);
    }
    const fallback = [...content.heroImages];
    while (fallback.length < 5) {
      fallback.push(...content.heroImages);
    }
    return fallback.slice(0, 5);
  }, [content.heroImages]);

  const stats = [
    { label: 'Guests', value: `${content.stats.guests}`, icon: Users },
    { label: 'Bedrooms', value: `${content.stats.bedrooms}`, icon: BedDouble },
    { label: 'Bathrooms', value: `${content.stats.bathrooms}`, icon: Bath },
    { label: 'Beds', value: `${content.stats.beds}`, icon: Layers },
  ];

  const amenitiesMidpoint = Math.ceil(content.amenities.length / 2);
  const amenitiesColumns = [content.amenities.slice(0, amenitiesMidpoint), content.amenities.slice(amenitiesMidpoint)];

  return (
    <div className="min-h-screen bg-[#fdf6ef] text-slate-900">
      <header className="border-b border-[#efe1cf] bg-white/90 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section className="rounded-[36px] bg-white/70 p-4 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="grid h-[520px] grid-cols-5 grid-rows-2 gap-3">
            <div className="relative col-span-3 row-span-2 overflow-hidden rounded-[30px]">
              <img src={galleryImages[0]} alt={content.name} className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
              >
                View all photos
              </button>
            </div>
            {galleryImages.slice(1).map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-[30px]">
                <img src={image} alt={`${content.name} detail ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] bg-white/90 p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Property #{content.id}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{content.name}</h1>
              <p className="mt-2 text-lg text-slate-600">{content.headline}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm text-slate-600">
                <MapPin size={16} />
                {content.location.address}, {content.location.city}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Managed by The Flex</p>
              <button className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800">
                Request dates
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <stat.icon size={20} className="text-slate-600" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-[36px] bg-white/90 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">About this stay</h2>
              <p className="mt-4 text-base text-slate-600">{content.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {content.highlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-2xl border border-[#f2e5d4] bg-[#fdf9f4] p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{highlight.label}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] bg-white/90 p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Amenities</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                    {amenitiesColumns.map((column, columnIndex) => (
                      <ul key={columnIndex} className="space-y-2 text-sm text-slate-600">
                        {column.map((amenity) => (
                          <li key={amenity} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">House rules</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {content.houseRules.map((rule) => (
                      <li key={rule} className="rounded-2xl border border-dashed border-[#ead9c3] bg-[#fffdf7] px-3 py-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[36px] bg-white/90 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Neighborhood notes</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {content.nearby.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[36px] bg-white/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Guest reviews</p>
                  <h2 className="text-2xl font-semibold text-slate-900">What guests loved</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  <Star size={16} className="text-amber-400" />
                  {(reviewsQuery.data?.reviews.length ?? 0) > 0
                    ? `${reviewsQuery.data?.reviews.length} curated`
                    : 'No reviews yet'}
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {reviewsQuery.isLoading && <p className="text-sm text-slate-500">Loading approved reviews…</p>}
                {!reviewsQuery.isLoading && reviewsQuery.data?.reviews.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                    No reviews have been approved for this listing yet. Toggle selections inside the manager dashboard to
                    control what appears here.
                  </p>
                )}
                {reviewsQuery.data?.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-10 rounded-[36px] bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.15)]">
              <h3 className="text-lg font-semibold text-slate-900">Book your stay</h3>
              <p className="text-sm text-slate-500">Average nightly rate from £320</p>
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex flex-col gap-1 font-medium text-slate-700">
                  Check-in
                  <input type="date" className="rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1 font-medium text-slate-700">
                  Check-out
                  <input type="date" className="rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1 font-medium text-slate-700">
                  Guests
                  <select className="rounded-2xl border border-slate-200 px-3 py-2 focus:border-slate-900 focus:outline-none">
                    <option>2 adults</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                    <option>5 guests</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="mt-2 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Request dates
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900"
                >
                  Chat with concierge
                </button>
              </div>
            </div>

            <div className="rounded-[36px] bg-white/90 p-6 shadow-sm lg:sticky lg:top-[480px]">
              <h3 className="text-lg font-semibold text-slate-900">Map</h3>
              <iframe
                title="map"
                src={content.location.mapEmbedUrl}
                width="100%"
                height="250"
                loading="lazy"
                className="mt-4 rounded-2xl border-0"
              />
              <p className="mt-2 text-sm text-slate-600">{content.location.address}</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default PropertyPage;

