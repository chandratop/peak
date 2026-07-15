import { gpx } from '@tmcw/togeojson';
import type { Feature, LineString, FeatureCollection } from 'geojson';

export function parseGpxToLineString(gpxText: string): Feature<LineString> | null {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml');
  const geojson = gpx(xmlDoc) as FeatureCollection;

  const lineFeature = geojson.features.find(
    (f) => f.geometry?.type === 'LineString'
  );

  return lineFeature ? (lineFeature as Feature<LineString>) : null;
}
