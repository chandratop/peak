import type { Map as MapboxMap, GeoJSONSource } from 'mapbox-gl';
import type { Feature, LineString, MultiLineString, FeatureCollection, Point } from 'geojson';
<<<<<<< HEAD
import type { Waypoint, PlanningPoint } from '@/types/route';
=======
import type { Waypoint } from '@/types/route';
>>>>>>> 98e19b6 (enhancements)
import { LAYER_IDS } from '@/lib/mapboxConfig';

export function addTerrain(map: MapboxMap): void {
  if (!map.getSource(LAYER_IDS.terrainSourceId)) {
    map.addSource(LAYER_IDS.terrainSourceId, {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14,
    });
  }
  // Separate source for hillshade — avoids the "used for both terrain and layer" resolution warning
  if (!map.getSource(LAYER_IDS.hillshadeSourceId)) {
    map.addSource(LAYER_IDS.hillshadeSourceId, {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14,
    });
  }

  map.setTerrain({
    source: LAYER_IDS.terrainSourceId,
    exaggeration: LAYER_IDS.terrainExaggeration,
  });
}

// Sky layer — dark-mode atmosphere gradient so the sky is distinguishable
export function addSky(map: MapboxMap): void {
  if (map.getLayer('peak-sky')) return;
  map.addLayer({
    id: 'peak-sky',
    type: 'sky',
    paint: {
      'sky-type': 'gradient',
      // horizon: very dark charcoal; zenith: pure black
      'sky-gradient': [
        'interpolate',
        ['linear'],
        ['sky-radial-progress'],
        0.0, 'rgba(28, 28, 36, 1)',   // near horizon — dark blue-grey
        0.5, 'rgba(12, 12, 18, 1)',   // mid sky — near-black indigo
        1.0, 'rgba(0, 0, 0, 1)',      // zenith — true black
      ],
      'sky-gradient-center': [0, 0],
      'sky-gradient-radius': 90,
      'sky-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5, 0.0,
        8, 0.6,
        12, 1.0,
      ],
    },
  });
}

// Hillshade — gives 3D depth to terrain in wireframe mode.
// Must be called BEFORE addContours so it renders beneath contour lines.
export function addHillshade(map: MapboxMap): void {
  if (map.getLayer('peak-hillshade')) return;
  map.addLayer({
    id: 'peak-hillshade',
    type: 'hillshade',
    source: LAYER_IDS.hillshadeSourceId,
    paint: {
      'hillshade-exaggeration': 0.4,
      'hillshade-shadow-color': '#000000',
      'hillshade-highlight-color': '#1a1a2e',
      'hillshade-accent-color': '#0a0a14',
      'hillshade-illumination-direction': 335,
    },
  });
}

export function addContours(map: MapboxMap): void {
  if (map.getSource(LAYER_IDS.contourSourceId)) return;
  map.addSource(LAYER_IDS.contourSourceId, {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2',
  });

  // Minor contours — faint background grid
  map.addLayer({
    id: `${LAYER_IDS.contourLayerId}-minor`,
    type: 'line',
    source: LAYER_IDS.contourSourceId,
    'source-layer': 'contour',
    filter: ['!=', ['get', 'index'], 5],
    paint: {
      'line-color': '#00d4ff',
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.4, 15, 0.8],
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.25, 15, 0.45],
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  });

  // Major contours (index = 5) — brighter emphasis lines
  map.addLayer({
    id: LAYER_IDS.contourLayerId,
    type: 'line',
    source: LAYER_IDS.contourSourceId,
    'source-layer': 'contour',
    filter: ['==', ['get', 'index'], 5],
    paint: {
      'line-color': '#00d4ff',
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 15, 2.0],
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.55, 15, 0.85],
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  });
}

export function addGpxRoute(map: MapboxMap, geojson: Feature<LineString | MultiLineString>): void {
  const source = map.getSource(LAYER_IDS.routeSourceId) as GeoJSONSource | undefined;
  if (source) { source.setData(geojson); return; }

  map.addSource(LAYER_IDS.routeSourceId, {
    type: 'geojson',
    data: geojson,
    lineMetrics: true,
  });

  // Glow layer — wide + blurred
  map.addLayer({
    id: LAYER_IDS.routeGlowLayerId,
    type: 'line',
    source: LAYER_IDS.routeSourceId,
    paint: {
      'line-color': '#ff6b2b',
      'line-width': 10,
      'line-opacity': 0.2,
      'line-blur': 6,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  });

  // Core line — sharp + high opacity
  map.addLayer({
    id: LAYER_IDS.routeLayerId,
    type: 'line',
    source: LAYER_IDS.routeSourceId,
    paint: {
      'line-color': '#ff6b2b',
      'line-width': 2.5,
      'line-opacity': 0.95,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  });
}

export function addWaypointMarkers(map: MapboxMap, waypoints: Waypoint[]): void {
  const featureCollection: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: waypoints.map((wp) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [wp.lng, wp.lat] },
      properties: {
        id: wp.id,
        name: wp.name,
        elevation_m: wp.elevation_m,
        camp_type: wp.camp_type,
      },
    })),
  };

  const source = map.getSource(LAYER_IDS.waypointSourceId) as GeoJSONSource | undefined;
  if (source) { source.setData(featureCollection); return; }
  map.addSource(LAYER_IDS.waypointSourceId, {
    type: 'geojson',
    data: featureCollection,
  });

  map.addLayer({
    id: LAYER_IDS.waypointLayerId,
    type: 'circle',
    source: LAYER_IDS.waypointSourceId,
    paint: {
      'circle-radius': [
        'match',
        ['get', 'camp_type'],
        'summit', 6,
        'highcamp', 5,
        'basecamp', 5,
        4,
      ],
      'circle-color': [
        'match',
        ['get', 'camp_type'],
        'summit', '#ff6b2b',
        'highcamp', '#ff6b2b',
        '#00d4ff',
      ],
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#000000',
      'circle-opacity': 0.95,
    },
  });
}

// Diagram only: kept out of route.gpx so it cannot be mistaken for a recorded course.
export function addPlanningOutline(map: MapboxMap, points: PlanningPoint[] = []): void {
  const data: FeatureCollection<LineString | Point> = {
    type: 'FeatureCollection',
    features: points.length < 2 ? [] : [
      { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: points.map(p => [p.lng, p.lat]) } },
      ...points.slice(1).map(p => ({ type: 'Feature' as const, properties: { name: p.name }, geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] } })),
    ],
  };
  const source = map.getSource('peak-planning-outline') as GeoJSONSource | undefined;
  if (source) { source.setData(data); return; }
  map.addSource('peak-planning-outline', { type: 'geojson', data });
  map.addLayer({ id: 'peak-planning-line', type: 'line', source: 'peak-planning-outline', filter: ['==', ['geometry-type'], 'LineString'], paint: { 'line-color': '#00d4ff', 'line-width': 2, 'line-dasharray': [3, 3], 'line-opacity': 0.7 } });
  map.addLayer({ id: 'peak-planning-points', type: 'circle', source: 'peak-planning-outline', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 5, 'circle-color': '#000000', 'circle-stroke-color': '#00d4ff', 'circle-stroke-width': 2 } });
}
