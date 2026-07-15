# Peak

Tactical mountaineering expedition dashboard. AMOLED black, 3D terrain, GitOps data model.

**Live:** [chandratop.github.io/peak](https://chandratop.github.io/peak)

---

![Stack](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![Mapbox](https://img.shields.io/badge/Mapbox_GL_JS-v3-00d4ff?style=flat-square) ![Deploy](https://img.shields.io/badge/GitHub_Pages-static_export-ff6b2b?style=flat-square)

## What it is

A multi-expedition mountaineering dashboard — route waypoints, gear manifest, and a live 3D map. Currently configured for **Kalanag (Black Peak, 6387m, Uttarakhand)**.

- AMOLED `#000000` base, JetBrains Mono, neon-orange / neon-cyan accents
- Mapbox 3D terrain with custom wireframe contour overlay, satellite, and topo modes
- Per-segment metrics: distance, elevation gain/loss, average grade, Naismith effort hours
- Floating panel: collapse to hide, expand to two-column detail view
- All data in flat files — no database, no backend

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router, `output: 'export'` |
| Bundler | Turbopack |
| Map | Mapbox GL JS v3 |
| Styling | Tailwind CSS v3 |
| Data | CSV + JSON + GPX in `public/data/<slug>/` |
| Deploy | GitHub Actions → GitHub Pages |

## URLs

| URL | Content |
|-----|---------|
| `/peak/` | Landing page — expedition selector |
| `/peak/kalanag` | Kalanag dashboard |
| `/peak/<slug>` | Any future expedition |

---

## Updating the gear list

The gear manifest lives at `public/data/kalanag/gear-manifest.csv`. Edit it directly in GitHub or locally and push — the site redeploys automatically.

**Column reference:**

| Column | Values | Notes |
|--------|--------|-------|
| `item_name` | any string | Displayed as-is |
| `category` | `clothing` `shelter` `technical` `navigation` `medical` `food` `electronics` `misc` | Used for filter pills |
| `weight_g` | integer | Weight of one unit in grams |
| `qty` | integer | Number of units; displayed weight = `weight_g × qty` |
| `status` | `packed` `pending` | `packed` = in the bag (cyan); `pending` = still to pack (orange) |
| `priority` | `critical` `optional` | `critical` + `pending` highlights the row in orange |

**Example — add a new item:**
```csv
Satellite Phone,electronics,290,1,pending,critical
```

**With Claude:** Open the repo in Claude Code and say _"add a satellite phone (290g, electronics, critical, pending) to the Kalanag gear list"_ — it will edit the CSV and you can commit.

---

## Adding a new expedition

Five steps, no component code changes required.

### 1. Add an entry to the registry

Edit `src/lib/expeditions.ts` and append to `EXPEDITIONS`:

```ts
{
  slug: 'manaslu',                           // becomes /peak/manaslu
  peakName: 'MANASLU',
  elevationM: 8163,
  region: 'Gorkha · Nepal',
  pageTitle: 'PEAK — Manaslu Expedition Dashboard',
  pageDescription: '3D wireframe mapping for Manaslu (Mountain of the Spirit)',
  mapView: {
    center: [84.5590, 28.5497],              // [lng, lat] — summit coordinates
    zoom: 12,
    pitch: 60,
    bearing: -20,
  },
},
```

### 2. Create data directory

```
public/data/manaslu/
  route.gpx              ← GPX track exported from Gaia GPS, CalTopo, etc.
  route-waypoints.json   ← waypoint list (schema below)
  gear-manifest.csv      ← gear list (schema above)
```

### 3. Push

```bash
git add .
git commit -m "Add Manaslu expedition"
git push origin main
```

The new expedition appears on the landing page at `/peak/` and its dashboard is live at `/peak/manaslu`.

**With Claude:** In a new session, say _"add a new expedition for Manaslu 8163m Nepal, center coordinates [84.5590, 28.5497]"_ — it will read `CLAUDE.md`, update the registry, create the data directory skeleton, and prompt you for the actual GPX/waypoint data.

---

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

---

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
    "region": "Black Peak, Uttarakhand, India"
  },
  "waypoints": [
    {
      "id": "sankri",                        // unique slug
      "name": "Sankri Village",
      "lat": 31.023,
      "lng": 78.182,
      "elevation_m": 1920,
      "camp_type": "waypoint",              // waypoint | basecamp | camp | highcamp | summit
      "description": "Roadhead",            // optional — shown in expanded panel
      "distance_from_start_km": 0,
      "max_grade_pct": 38,                  // optional — max grade of arriving segment
      "min_grade_pct": 8                    // optional — min grade of arriving segment
    }
  ]
}
```

### `gear-manifest.csv`
```
item_name,category,weight_g,qty,status,priority
Sleeping Bag,shelter,1200,1,packed,critical
Crampons,technical,1200,1,pending,critical
Trekking Poles,technical,480,2,packed,optional
```
