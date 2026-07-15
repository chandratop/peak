# Peak

Tactical mountaineering expedition dashboard. AMOLED black, 3D terrain, GitOps data model.

**Live:** [chandratop.github.io/peak](https://chandratop.github.io/peak)

---

![Stack](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![Mapbox](https://img.shields.io/badge/Mapbox_GL_JS-v3-00d4ff?style=flat-square) ![Deploy](https://img.shields.io/badge/GitHub_Pages-static_export-ff6b2b?style=flat-square)

## What it is

A single-page dashboard for tracking a mountaineering expedition — route waypoints, gear manifest, and a live 3D map. Currently configured for **Kalanag (Black Peak, 6387m, Uttarakhand)**.

- AMOLED `#000000` base, JetBrains Mono, neon-orange / neon-cyan accents
- Mapbox 3D terrain with custom wireframe contour overlay, satellite, and topo modes
- Per-segment metrics: distance, elevation gain/loss, average grade, Naismith effort hours
- Floating panel with collapse / expand-with-blur states
- All data in flat files — no database, no backend

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router, `output: 'export'` |
| Bundler | Turbopack |
| Map | Mapbox GL JS v3 |
| Styling | Tailwind CSS v3 |
| Data | CSV + JSON + GPX in `public/data/` |
| Deploy | GitHub Actions → GitHub Pages |

## Bootstrapping for a new expedition

Four files to change, nothing else:

**1. `src/lib/expedition.config.ts`**
```ts
export const EXPEDITION: ExpeditionConfig = {
  peakName: 'KALANAG',
  elevationM: 6387,
  region: 'Har-ki-Dun · Uttarakhand · India',
  pageTitle: 'PEAK — Kalanag Expedition Dashboard',
  pageDescription: '...',
  mapView: {
    center: [78.5681, 31.0264],  // [lng, lat] of summit
    zoom: 12,
    pitch: 60,
    bearing: -20,
  },
  gpxPath: `${BASE_PATH}/data/route.gpx`,
};
```

**2. `public/data/route.gpx`** — GPX track for the route

**3. `public/data/route-waypoints.json`** — waypoints with elevation, distance, camp type, optional grade range

**4. `public/data/gear-manifest.csv`** — gear list with weight, category, status

## Local development

```bash
# 1. Clone
git clone git@github.com:chandratop/peak.git && cd peak

# 2. Install
npm install

# 3. Add Mapbox token
echo "NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here" > .env.local

# 4. Run
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Deployment

Push to `main` triggers GitHub Actions → builds static export → deploys to GitHub Pages.

**Required secrets** (Settings → Secrets → Actions):
- `NEXT_PUBLIC_MAPBOX_TOKEN`

**Required Pages setting** (Settings → Pages):
- Source: **GitHub Actions**

## Data schemas

### `route-waypoints.json`
```jsonc
{
  "metadata": {
    "route_name": "Kalanag South Ridge",
    "peak_name": "Kalanag",
    "summit_elevation_m": 6387,
    "total_distance_km": 42.0,
    "total_gain_m": 4467,
    "region": "Har-ki-Dun, Uttarakhand, India"
  },
  "waypoints": [
    {
      "id": "sankri",
      "name": "Sankri Village",
      "lat": 31.023,
      "lng": 78.182,
      "elevation_m": 1920,
      "camp_type": "waypoint",       // waypoint | basecamp | camp | highcamp | summit
      "description": "Roadhead",
      "distance_from_start_km": 0,
      "max_grade_pct": 38,           // optional — max grade of arriving segment
      "min_grade_pct": 8             // optional — min grade of arriving segment
    }
  ]
}
```

### `gear-manifest.csv`
```
item_name,category,weight_g,qty,status,priority
Sleeping Bag,shelter,1200,1,confirmed,essential
```
`status`: `confirmed` | `pending` | `optional`  
`priority`: `essential` | `important` | `optional`
