# Flex Living · Reviews Dashboard

Modern full-stack assessment that mirrors The Flex’s internal tooling needs:

- A mocked Hostaway reviews integration with actionable rollups.
- A manager-friendly dashboard to filter, analyse, chart, and curate guest feedback.
- A public property page that only displays the reviews managers approve.
- A lightweight exploration of Google Reviews ingestion.

The repo contains two workspaces:

```
.
├── backend   # Express + TypeScript API
└── frontend  # React + Vite + Tailwind dashboard & property UI
```

## Tech stack

- **Backend:** Node 20, Express 5, TypeScript, Vitest/Supertest.
- **Frontend:** React 19, Vite, TailwindCSS, React Query, Chart.js.
- **Data handling:** Axios, lodash-style helpers, in-memory mock data + JSON persistence.

## Quick start

1. **Clone & install**
   ```bash
   git clone <repo>
   cd flex-living-dev-assignment
   npm install --prefix backend
   npm install --prefix frontend
   ```
2. **Run the API**
   ```bash
   cd backend
   npm run dev            # http://localhost:4000
   ```
3. **Run the web app**
   ```bash
   cd ../frontend
   npm run dev            # http://localhost:5173
   ```
4. **(Optional) Enable live Google reviews**
   - Create `backend/.env` (if it doesn’t exist)
   - Add `GOOGLE_PLACES_API_KEY=<your Google Places key>` (and restart `npm run dev`)
5. **Sign in**
   - Navigate to `http://localhost:5173/login`
   - Access code: `flex-manager`

> The dev server proxies `/api/*` to `http://localhost:4000`. In a hosted setup set `VITE_API_URL=https://your-api.example.com`.

## Key routes

| Purpose | Method & path | Notes |
| --- | --- | --- |
| Hostaway summary | `GET /api/reviews/hostaway` | Supports filtering by channel, rating range, date window, search, and pagination. Returns grouped property stats, category averages, trend data, keyword insights. |
| Google reviews | `GET /api/reviews/google?listingId=` | Pulls live Google reviews (via Places Details API) when `GOOGLE_PLACES_API_KEY` is set; falls back to mocks otherwise. |
| Import Google reviews | `POST /api/reviews/google/import` | Persists selected Google reviews (per listing) so they appear in the approval queue. Body: `{ listingId, placeId?, reviews: [...] }`. |
| Toggle Google publish state | `PATCH /api/reviews/google/import` | Marks imported Google reviews as published/unpublished (`{ listingId, reviewId, published }`). |
| Review selection | `GET/POST /api/reviews/selection` | Persists approved review IDs to `backend/storage/selectedReviews.json`. |
| Public reviews | `GET /api/reviews/public?listingId=...` | Surfaces only approved + published reviews for the guest-facing property page. |

## Testing

- **Backend unit tests** (`vitest` + `supertest`):
  ```bash
  cd backend
  npm test
  ```
- **Frontend build check**:
  ```bash
  cd frontend
  npm run build
  ```

## Project structure highlights

- `backend/src/utils/reviewAggregator.ts` — Normalises raw reviews, computes category/channel averages, trends, recurring keywords, and auto-flagging.
- `backend/storage/selectedReviews.json` — Simple JSON persistence for manager-approved reviews.
- `frontend/src/pages/DashboardPage.tsx` — Manager workspace with filters, charts, keyword chips, Google review primer, and approval queue.
- `frontend/src/pages/PropertyPage.tsx` — Public layout inspired by theflex.global, including curated review cards, amenities, booking widget, and map embed.
- `frontend/src/hooks/useSelections.ts` — React Query wrapper for synchronising approval state with the backend.
- `frontend/src/contexts/AuthContext.tsx` — Simple mocked auth (persisted in `localStorage`) guarding the dashboard route.

## Additional notes

- Hostaway credentials (`61148` & sandbox key) are surfaced in API metadata but no real calls are made; data is mocked per the assessment brief.
- Google Places integration now hits the live Places Details API when `GOOGLE_PLACES_API_KEY` is set; override the source per listing with `GOOGLE_PLACE_ID_<listingId>` (or fallback to `GOOGLE_PLACE_ID_DEFAULT`). Responses are cached for 30 minutes to stay within quota, and managers can import selected reviews into the publishing queue with a single click.
- Charts use Chart.js (line + bar) to spotlight portfolio-level trends and per-category health.
- The dashboard auto-flags reviews <3★ for quick triage and exposes keyword chips to surface recurring issues.
- Approved reviews immediately flow to `/property/:id`, so managers control guest-facing sentiment without manual edits.

## Deployment

1. Deploy the backend (e.g., Render, Railway) via `npm run build && npm start`.
2. Set `VITE_API_URL` to the deployed API URL before running `npm run build` inside `frontend`.
3. Host the `frontend/dist` folder on Netlify/Vercel/S3 + CloudFront.

## Documentation

Extended rationale, architecture decisions, and Google Reviews findings live in `docs/DECISIONS.md`.

