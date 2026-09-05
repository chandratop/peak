import { gpx } from '@tmcw/togeojson';
import type { Feature, LineString, MultiLineString } from 'geojson';

// Preserve separate tracks/segments rather than inventing connecting route lines.
export function parseGpxTrack(text: string): Feature<LineString | MultiLineString> {
  const document = new DOMParser().parseFromString(text, 'text/xml');
  if (document.getElementsByTagName('parsererror').length || document.documentElement.localName !== 'gpx') throw new Error('Invalid GPX XML');
  const lines: number[][][] = [];
  for (const feature of gpx(document).features) {
    if (feature.geometry?.type === 'LineString') lines.push(feature.geometry.coordinates);
    if (feature.geometry?.type === 'MultiLineString') lines.push(...feature.geometry.coordinates);
  }
  if (!lines.length || lines.some(line => line.length < 2 || line.some(p => p.length < 2 || !p.every(Number.isFinite) || Math.abs(p[0]) > 180 || Math.abs(p[1]) > 90))) throw new Error('GPX must contain valid route or track segments');
  return { type: 'Feature', properties: {}, geometry: lines.length === 1 ? { type: 'LineString', coordinates: lines[0] } : { type: 'MultiLineString', coordinates: lines } };
}
