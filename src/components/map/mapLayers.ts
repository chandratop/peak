import type { Map as MapboxMap } from 'mapbox-gl';
import type { Feature, LineString, FeatureCollection, Point } from 'geojson';
import type { Waypoint } from '@/types/route';
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
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.4, 15, 0.8] as unknown as number,
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.25, 15, 0.45] as unknown as number,
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
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 15, 2.0] as unknown as number,
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.55, 15, 0.85] as unknown as number,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  });
}

export function addGpxRoute(map: MapboxMap, geojson: Feature<LineString>): void {
  if (map.getSource(LAYER_IDS.routeSourceId)) return;

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
  if (map.getSource(LAYER_IDS.waypointSourceId)) return;
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
      ] as unknown as number,
      'circle-color': [
        'match',
        ['get', 'camp_type'],
        'summit', '#ff6b2b',
        'highcamp', '#ff6b2b',
        '#00d4ff',
      ] as unknown as string,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#000000',
      'circle-opacity': 0.95,
    },
  });
}
