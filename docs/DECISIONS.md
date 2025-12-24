# Flex Reviews – Technical Decisions & Findings

## 1. Architecture Overview

| Layer | Details |
| --- | --- |
| **API** | Express + TypeScript. The server exposes mocked Hostaway and Google review routes, as well as persistence endpoints for manager-approved reviews. Data lives in memory + `storage/selectedReviews.json`, mimicking a lightweight store without introducing a full DB layer. |
| **Frontend** | React 19 + Vite for fast DX. TailwindCSS ensures consistent design tokens. React Query manages API cache/state, while Chart.js renders performance trends and category breakdowns. |
| **Authentication** | Lightweight client-side gate (email + access code). Persistence relies on `localStorage` since a full auth system is out of scope but the dashboard still feels private. |
| **Data Flow** | The backend returns a rich `HostawaySummaryPayload` (properties, trends, keyword insights). Frontend filters are processed server-side for accuracy but also managed on the client for responsiveness. Approved review IDs are synced through React Query mutations so the property page always reflects the manager’s selection. |

## 2. Mocked Hostaway Strategy

- **Data realism:** Reviews mimic Hostaway’s JSON (category ratings out of 10, varying statuses, channels, and timestamps over 16 months). Trends therefore feel authentic and charts show clear dips/spikes.
- **Normalisation:** Everything is converted to a uniform 5-star scale (`rating / 2`). Nulls stay null to avoid inflating averages. Category averages and channel breakdowns respect `noUncheckedIndexedAccess`.
- **Insights:** The aggregator computes:
  - Portfolio overview (avg, totals, pagination metadata).
  - Time-series data (monthly average + count) for the line chart.
  - Keyword chips by scanning review text against curated dictionaries (cleanliness, wifi, heating, etc.).
  - Auto-flagged reviews (<3★) to highlight risk.
- **Filtering:** `GET /api/reviews/hostaway` accepts `channel`, `listingId`, `minRating`, `maxRating`, `startDate`, `endDate`, and `search`. This mirrors what a product owner would expect from a performance dashboard.

## 3. Manager Dashboard UX

- **Layout:** Sidebar + top bar shell, filter panel, insights cards, charts, property cards, and approval queue. Designed mobile-aware but optimised for desktop manager workflows.
- **Filters:** Search, channel dropdown, numeric rating range, and date pickers. Filtering triggers a refetch (React Query) so stats and charts always align with the selection.
- **Charts:** Line chart for rolling ratings and horizontal bars per category. Chart.js is registered once via `lib/chartConfig.ts`.
- **Keyword cloud:** Simple chip sizing communicates frequency without extra dependencies (word cloud libs are heavy).
- **Review selection:** Each review card includes metadata, sentiment chips, and an “Approve/Publish” toggle. Toggles call `POST /api/reviews/selection`, updating the JSON store and invalidating the cache so the property page stays in sync.

## 4. Property Page Replica

- **Layout cues:** Hero image with gradient overlay, highlight chips, description, amenity grid, booking widget, sidebar map, and the new “Guest Reviews” section.
- **Dynamic reviews:** `/property/:id` fetches `/api/reviews/public?listingId=...`. If no reviews were approved, a helpful placeholder reminds managers to use the dashboard.
- **Content source:** `data/propertyContent.ts` stores curated copy/amenities to mimic the existing The Flex marketing site.

## 5. Google Reviews Integration

- **Live fetches:** When `GOOGLE_PLACES_API_KEY` is present, `/api/reviews/google` calls the Places Details REST endpoint (`fields=reviews,user_ratings_total,rating,name`). Results are cached in-memory for 30 minutes per Place ID to stay within quota.
- **Place ID mapping:** Each listing can declare a Place ID via `GOOGLE_PLACE_ID_<listingId>` in `backend/.env`. The repo ships with reasonable London placeholders inside `src/data/googlePlaces.ts`, so the dashboard works out of the box even before custom IDs are added.
- **Import flow:** Managers can multi-select reviews and click “Import to dashboard”. The request hits `POST /api/reviews/google/import`, storing a snapshot (author, rating, text) in `storage/googleImported.json`. Imported reviews appear in the publishing queue alongside Hostaway entries with a “Publish” toggle powered by `PATCH /api/reviews/google/import`.
- **Public output:** `/api/reviews/public` merges approved Hostaway + published Google reviews so property pages surface a curated blend of both sources (with the `channel` field set to `Google` for transparency).
- **Error handling:** Missing keys or API errors surface a descriptive message (and React Query will surface the error state). The backend still exposes mock data via a fallback payload so the UI can render without hard failures in demo mode.

## 6. Testing & Quality

- Backend tests cover:
  - Aggregation success state.
  - Listing-specific filtering.
  - Selection persistence round-trip.
- Frontend build acts as a type/lint gate since Vite + TypeScript enforce `verbatimModuleSyntax` and strict mode.
- Manual QA emphasis:
  - Approving/unapproving reviews reflects instantly on `/property/253093`.
  - Filters + charts respond to rating/channel changes.
  - Mock login + logout flows.

## 7. Future Enhancements

1. **Role-based permissions:** Expand the auth mock to differentiate editors vs viewers.
2. **Sentiment analysis:** Use a lightweight NLP model to auto-tag reviews by sentiment or detect category-level regressions.
3. **Bulk actions:** Allow managers to approve multiple reviews at once and add notes (e.g., “Followed up with guest”).
4. **Notifications:** Pipe flagged reviews into Slack or email digests.
5. **Real storage:** Swap the JSON file for SQLite/Supabase to support multi-user edits and audit history.

