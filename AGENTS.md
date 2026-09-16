# Peak codebase guide

## Product and architecture
Peak is a static, multi-expedition mountaineering dashboard. Next.js 16 App Router,
React, TypeScript strict, Tailwind 3, and Mapbox GL JS 3. Preserve the black,
monospace interface with orange/cyan accents.

- `src/lib/expeditions.ts` is the expedition registry and initial map camera source.
- `src/app/page.tsx` lists expeditions. `[expedition]/page.tsx` generates registered
  expedition pages at build time; unknown slugs are not exported.
- Each expedition owns `public/data/<slug>/route.gpx`, `route-waypoints.json`,
  `gear-manifest.csv`, and `itinerary.csv`. Adding an expedition requires a
  registry entry and these files.
- `SplitLayout` provides expedition/map context and responsive panel state. At
  widths below 768px details use a bottom sheet with Route/Itinerary/Gear tabs.
  Wider screens use a side panel. Keep feeds mounted so filters survive panel changes.
- `useExpeditionData` shares file requests by URL and ignores obsolete responses.
  `dataValidation.ts` validates authored CSV/JSON before rendering.
- GPX geometry supplies the map route. Waypoint JSON supplies the elevation profile,
  summary and segment estimates. These are separate sources, not interchangeable.
- Gear weight is unit grams × quantity. Packing percentage counts manifest rows.
  Rucksack vs non-rucksack weight totals split an `all but one` row as
  `qty - 1` packed and 1 unit external; `yes` counts fully in the rucksack,
  `no` counts fully outside it.

## Data contracts
Gear CSV columns: `item_name,category,weight_g,qty,status,in_rucksack`.
Categories: clothing, shelter, technical, navigation, medical, food, electronics, misc.
Status: packed/pending. `in_rucksack`: yes/no/all but one — see the weight-split
rule above. Weight must be finite and nonnegative; quantity must be a positive
integer.

Itinerary CSV columns: `day,date,route,altitude_m,type,duration,accommodation,network,notes`.
Type: drive/trek/mixed/mountaineering. `day` must be a unique positive integer;
`date` is `YYYY-MM-DD`; `altitude_m` may be empty. Itinerary days are trip-specific
planning data reconstructed from an operator's published schedule, not a verified
route — treat dates, durations and network status as estimates to confirm before
departure, same as the Kalanag planning outline.

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

## Kalanag route provenance
`public/data/kalanag/ROUTE-SOURCES.md` documents the supplied approach and separate
schematic continuation. `route.gpx` ends at Ruinsara. `metadata.planning_outline`
is drawn dashed and is excluded from GPX, elevation profiles and distance totals.
Do not convert this planning diagram into a navigation course or invent high camps.
