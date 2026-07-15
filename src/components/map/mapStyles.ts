import type { MapStyleMode } from '@/lib/mapContext';

// ── Wireframe: pure black void, custom contours painted on top ──────────────
export const MINIMAL_DARK_STYLE = {
  version: 8,
  name: 'Peak Wireframe',
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#000000' },
    },
  ],
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}',
  sprite: 'mapbox://sprites/mapbox/dark-v11',
} as const;

// ── Satellite: Mapbox satellite imagery base ─────────────────────────────────
// Custom layers (terrain, route) are added after styledata fires.
export const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-v9';

// ── Topo: Mapbox Outdoors stripped to terrain + hillshade, earthy palette ───
export const TOPO_STYLE = 'mapbox://styles/mapbox/outdoors-v12';

export function getBaseStyle(mode: MapStyleMode): string | object {
  switch (mode) {
    case 'satellite': return SATELLITE_STYLE;
    case 'topo':      return TOPO_STYLE;
    default:          return MINIMAL_DARK_STYLE;
  }
}

// Whether a mode uses a hosted Mapbox style (true) vs our custom JSON (false).
// Hosted styles already include their own background/hillshade/imagery layers —
// we only overlay terrain DEM + our route on top; we skip addContours() for them.
export function isHostedStyle(mode: MapStyleMode): boolean {
  return mode === 'satellite' || mode === 'topo';
}
