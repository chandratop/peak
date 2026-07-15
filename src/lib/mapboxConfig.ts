import type { LayerConfig } from '@/types/map';

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (!token && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_MAPBOX_TOKEN is not set');
}

export const MAPBOX_TOKEN = token ?? '';

export const LAYER_IDS: LayerConfig = {
  terrainSourceId: 'mapbox-terrain-dem',
  hillshadeSourceId: 'mapbox-terrain-dem-hillshade',
  terrainExaggeration: 1.5,
  contourSourceId: 'mapbox-terrain-v2',
  contourLayerId: 'peak-contours',
  routeSourceId: 'peak-route',
  routeLayerId: 'peak-route-line',
  routeGlowLayerId: 'peak-route-glow',
  waypointSourceId: 'peak-waypoints',
  waypointLayerId: 'waypoint-markers',
};
