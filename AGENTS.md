# Peak codebase guide

## Product and architecture
Peak is a static, multi-expedition mountaineering dashboard. Next.js 16 App Router,
React, TypeScript strict, Tailwind 3, and Mapbox GL JS 3. Preserve the black,
monospace interface with orange/cyan accents.

- `src/lib/expeditions.ts` is the expedition registry and initial map camera source.
- `src/app/page.tsx` lists expeditions. `[expedition]/page.tsx` generates registered
  expedition pages at build time; unknown slugs are not exported.
- Each expedition owns `public/data/<slug>/route.gpx`, `route-waypoints.json`, and
  `gear-manifest.csv`. Adding an expedition requires a registry entry and these files.
- `SplitLayout` provides expedition/map context and responsive panel state. At
  widths below 768px details use a bottom sheet with Route/Gear tabs. Wider screens
  use a side panel. Keep feeds mounted so filters survive panel changes.
- `useExpeditionData` shares file requests by URL and ignores obsolete responses.
  `dataValidation.ts` validates authored CSV/JSON before rendering.
- GPX geometry supplies the map route. Waypoint JSON supplies the elevation profile,
  summary and segment estimates. These are separate sources, not interchangeable.
- Gear weight is unit grams × quantity. Packing percentage counts manifest rows.

## Data contracts
Gear CSV columns: `item_name,category,weight_g,qty,status,priority`.
Categories: clothing, shelter, technical, navigation, medical, food, electronics, misc.
Status: packed/pending. Priority: critical/optional. Weight must be finite and
nonnegative; quantity must be a positive integer.

Waypoints require unique IDs, valid coordinates, elevation, camp type and unique,
nonnegative `distance_from_start_km`. See `src/types/route.ts` and the Kalanag JSON.
Metadata summary totals are authored values. Segment elevation is a signed endpoint
change, not accumulated ascent. Slope labels are not climbing difficulty ratings.
GPX supports LineString and MultiLineString tracks, preserving disconnected segments.

## Map lifecycle
MapView is browser-only through MapViewLoader. Register custom layers after
`style.load`; do not use `styledata` for this. Style switches use a full replacement.
Layer helpers guard existing sources/layers. Route and waypoint helpers update
existing GeoJSON sources. Terrain and hillshade use separate DEM sources.
Clean up listeners and maps; check asynchronous Mapbox errors as well as React errors.
The map fills the viewport beneath the panel and does not resize with panel changes.

## Development and checks
- `npm ci`
- Copy `.env.example` to `.env.local` and provide a public Mapbox token.
- `npm run dev`: open http://localhost:3000 (empty base path).
- `npm run type-check`
- `npm test`: data parsing and calculation tests.
- `npx playwright install chromium` then `npm run test:e2e`: desktop/mobile smoke tests.
- `npm run build`: static export in `out/`; serve with a static file server.
- `NEXT_PUBLIC_BASE_PATH=/peak npm run build`: GitHub Pages path configuration.

No backend APIs, runtime server rendering or ISR. Registered dynamic route segments
are allowed because they are generated statically. Do not use `next start` for export.
GitHub Actions checks and exports on main, then deploys to Pages using the public
Mapbox token secret. Never commit local environment files.

## Change validation
Check desktop and mobile layouts, collapse/expand, filters, waypoint selection,
keyboard focus, no horizontal overflow, and data failure messages. Live map checks
also require a valid token and network access. Do not present automated data checks
as verification of the geographic accuracy of authored expedition data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
