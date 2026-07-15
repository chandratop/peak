# Peak — Codebase Guide

Mountaineering expedition dashboard. Next.js 16 App Router, `output: 'export'` (static GitHub Pages), Mapbox GL JS v3, Tailwind CSS v3, TypeScript strict.

## Bootstrapping a new expedition

Four files to change, nothing else:

1. **`src/lib/expedition.config.ts`** — update all 7 fields:
   - `peakName` — displayed in panel header and map aria-label
   - `elevationM` — displayed next to peak name
   - `region` — sub-heading line
   - `pageTitle` / `pageDescription` — HTML `<title>` and meta
   - `mapView.center` — `[lng, lat]` of the summit
   - `mapView.zoom` / `pitch` / `bearing` — initial camera
   - `gpxPath` — path under `/public`, e.g. `/data/route.gpx`

2. **`public/data/route.gpx`** — replace with the new GPX track

3. **`public/data/route-waypoints.json`** — replace with new waypoints (schema below)

4. **`public/data/gear-manifest.csv`** — replace with new gear list (schema below)

No component code changes required.

## Data schemas

### `route-waypoints.json`
```jsonc
{
  "metadata": {
    "route_name": "...",
    "peak_name": "...",
    "summit_elevation_m": 6387,
    "total_distance_km": 42.0,
    "total_gain_m": 4467,
    "region": "..."
  },
  "waypoints": [
    {
      "id": "unique-slug",
      "name": "Display Name",
      "lat": 31.02,
      "lng": 78.57,
      "elevation_m": 1920,
      "camp_type": "waypoint",        // waypoint | basecamp | camp | highcamp | summit
      "description": "optional",
      "distance_from_start_km": 0,
      "max_grade_pct": 38,            // optional — arriving segment max grade
      "min_grade_pct": 8              // optional — arriving segment min grade
    }
  ]
}
```

### `gear-manifest.csv`
```
item_name,category,weight_g,qty,status,packed
Sleeping Bag,shelter,1200,1,confirmed,false
...
```
`status`: `confirmed` | `pending` | `optional`

## Architecture

```
src/
  app/
    layout.tsx          ← metadata from EXPEDITION config
    page.tsx            ← renders SplitLayout
  components/
    layout/
      SplitLayout.tsx   ← overlay layout, MapContext provider, 3-state panel
      LeftPanel.tsx     ← header (from config) + GearFeed + WaypointFeed
      RightPanel.tsx    ← ErrorBoundary + MapViewLoader + MapStyleSwitcher
    map/
      MapView.tsx       ← Mapbox init + layer management (ssr:false via MapViewLoader)
      mapLayers.ts      ← all add*() functions — idempotent, guard with getSource/getLayer
      mapStyles.ts      ← MINIMAL_DARK_STYLE, SATELLITE_STYLE, TOPO_STYLE, getBaseStyle()
      MapStyleSwitcher.tsx
    route/
      WaypointFeed.tsx  ← route summary stats + ElevationProfile + WaypointCard list
      WaypointCard.tsx  ← per-waypoint: flyTo on click, segment metrics (distance/grade/effort)
      ElevationProfile.tsx
    gear/
      GearFeed.tsx / GearItem.tsx / GearFilters.tsx / GearStats.tsx
    ui/                 ← SectionHeader, Divider, StatusBadge, LoadingSkeleton, ErrorBoundary
  hooks/
    useGpxTrack.ts      ← fetches EXPEDITION.gpxPath → GeoJSON LineString
    useRouteWaypoints.ts← fetches /data/route-waypoints.json
    useGearManifest.ts  ← fetches /data/gear-manifest.csv (PapaParse)
  lib/
    expedition.config.ts← SINGLE SOURCE OF TRUTH for expedition identity + map view
    mapboxConfig.ts     ← MAPBOX_TOKEN + LAYER_IDS (all Mapbox source/layer name constants)
    mapContext.ts       ← MapContext: mapRef, mapStyle, setMapStyle
    routeUtils.ts       ← computeSegmentMetrics(), gradeToEffortLabel()
    parseGpx.ts         ← GPX XML → GeoJSON (uses @tmcw/togeojson)
    weightUtils.ts      ← gear weight helpers
  types/
    map.ts              ← MapViewState, LayerConfig
    route.ts            ← RouteData, Waypoint, CampType
    gear.ts             ← GearItem, GearCategory
```

## Key patterns

**Mapbox layer registration** — every `add*()` function in `mapLayers.ts` is idempotent:
```ts
if (map.getSource(LAYER_IDS.routeSourceId)) return;
```
Call them freely; they no-op on repeat calls. Required because `applyCustomLayers()` runs on both init and style switches.

**Style switching** — use `map.once('style.load', handler)` not `styledata`. `styledata` fires on every tile update and races with incomplete styles.

**Terrain vs hillshade sources** — two separate raster-dem source registrations (`terrainSourceId` and `hillshadeSourceId`) pointing to the same Mapbox tileset. Required to avoid Mapbox resolution downgrade warning when the same source is used for both `setTerrain()` and a hillshade layer.

**Panel overlay** — map is always `absolute inset-0` (never resizes). Panel floats over it at `z-10`. No `map.resize()` calls needed. Three states: `normal` (400px opaque), `expanded` (72%, backdrop-blur-md), `collapsed` (w-0).

**SSR exclusion** — `MapView.tsx` is browser-only. `MapViewLoader.tsx` wraps it with `dynamic(() => import('./MapView'), { ssr: false })` and carries `'use client'`.

**Static export constraint** — `next.config.ts` has `output: 'export'`. No server-side APIs, no dynamic routes, no ISR. All data is fetched client-side from `/public/data/`.

## Mapbox style modes

| Key | Style | Notes |
|-----|-------|-------|
| `wireframe` | `MINIMAL_DARK_STYLE` (inline object) | Black base, cyan contours, hillshade, sky gradient |
| `satellite` | `mapbox://styles/mapbox/satellite-v9` | Hosted — terrain + route/waypoints re-added on style.load |
| `topo` | `mapbox://styles/mapbox/outdoors-v12` | Hosted — same |

Switching from inline→hosted triggers "Unimplemented: setSprite/setGlyphs" in the console — this is a known Mapbox limitation (style diff can't patch those fields), forces full rebuild. Not a bug, not fixable.

## Segment metrics (routeUtils.ts)

Given consecutive waypoints A → B:
- `distance_km` = `B.distance_from_start_km - A.distance_from_start_km`
- `elevation_gain_m` = `B.elevation_m - A.elevation_m` (signed)
- `avg_grade_pct` = `(gain / distance_m) * 100`
- `avg_angle_deg` = `atan2(gain, distance_m) * (180/π)`
- `naismith_hours` = `distance_km/5 + max(0, gain/600)`
- `effort_label`: TRAIL (<15%), STEEP (15–35%), SCRAMBLE (35–60%), TECHNICAL (>60%)

## Dev commands

```bash
npm run dev        # Turbopack dev server
npm run build      # Static export to /out
npm run type-check # tsc --noEmit
```

Requires `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`.
