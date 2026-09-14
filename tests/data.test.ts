import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseGear, parseWaypoints } from '../src/lib/dataValidation';
import { computeSegmentMetrics } from '../src/lib/routeUtils';
import { totalWeight } from '../src/lib/weightUtils';

const gear = readFileSync('public/data/kalanag/gear-manifest.csv', 'utf8');
const route = JSON.parse(readFileSync('public/data/kalanag/route-waypoints.json', 'utf8'));
test('shipped data validates and weights include quantities', () => {
  assert.equal(parseWaypoints(route).waypoints.length, 3);
  assert.equal(parseGear(gear).length, 47);
  assert.equal(totalWeight([{ weight_g: 100, qty: 3 }]), 300);
});
test('invalid CSV enums, quantities, weights and headers are rejected', () => {
  for (const bad of [gear.replace('580,1', '580,0'), gear.replace('1482,1', '-1,1'), gear.replace('pending,critical', 'confirmed,critical'), gear.replace('weight_g', 'weight'), gear.replace(',just one\n', ',sometimes\n')]) assert.throws(() => parseGear(bad));
});
test('duplicate distances and invalid coordinates are rejected', () => {
  const invalid = structuredClone(route); invalid.waypoints[1].distance_from_start_km = 0;
  assert.throws(() => parseWaypoints(invalid));
  invalid.waypoints[1].distance_from_start_km = 12; invalid.waypoints[0].lat = 100;
  assert.throws(() => parseWaypoints(invalid));
});
test('segment estimates account for ascent and reject non-increasing distances', () => {
  const a = { ...route.waypoints[0], elevation_m: 1920, distance_from_start_km: 0 };
  const b = { ...route.waypoints[1], elevation_m: 2400, distance_from_start_km: 12 };
  assert.equal(computeSegmentMetrics(a, b).naismith_hours, 3.2);
  assert.throws(() => computeSegmentMetrics(a, a));
  const descent = computeSegmentMetrics(a, { ...b, elevation_m: 1320 });
  assert.equal(descent.elevation_gain_m, -600);
  assert.equal(descent.naismith_hours, 2.4);
});

test('GPX preserves disconnected tracks and rejects empty input', async () => {
  const { DOMParser } = await import('@xmldom/xmldom');
  Object.assign(globalThis, { DOMParser });
  const { parseGpxTrack } = await import('../src/lib/parseGpx');
  const xml = readFileSync('public/data/kalanag/route.gpx', 'utf8');
  assert.equal(parseGpxTrack(xml).geometry.type, 'MultiLineString');
  const segment = '<trkseg><trkpt lat="30" lon="78"/><trkpt lat="31" lon="79"/></trkseg>';
  assert.equal(parseGpxTrack(`<gpx><trk>${segment}${segment}</trk></gpx>`).geometry.type, 'MultiLineString');
  assert.throws(() => parseGpxTrack('<gpx/>'));
});

test('planning outline is separate from imported approach and cannot silently become route data', async () => {
  const { DOMParser } = await import('@xmldom/xmldom');
  Object.assign(globalThis, { DOMParser });
  const { parseGpxTrack } = await import('../src/lib/parseGpx');
  const feature = parseGpxTrack(readFileSync('public/data/kalanag/route.gpx', 'utf8'));
  assert.equal(feature.geometry.type, 'MultiLineString');
  if (feature.geometry.type !== 'MultiLineString') throw new Error('Expected separate stages');
  assert.deepEqual(feature.geometry.coordinates.map(line => line.length), [346, 128]);
  assert.deepEqual(feature.geometry.coordinates[1].at(-1)?.slice(0, 2), [78.4577, 31.080854]);
  assert.equal(route.metadata.coverage, 'approach-only');
  assert.equal(route.metadata.total_distance_km, 25.6);
  const invalid = structuredClone(route);
  invalid.metadata.planning_outline[0].lat = 100;
  assert.throws(() => parseWaypoints(invalid));
});

test('planning geometry is rendered dashed and updates without duplicating layers', async () => {
  const { addPlanningOutline } = await import('../src/components/map/mapLayers');
  const sources = new Map<string, { data: unknown; setData: (data: unknown) => void }>();
  const layers: Array<{ id: string; paint: Record<string, unknown> }> = [];
  const map = {
    getSource: (id: string) => sources.get(id),
    addSource: (id: string, options: { data: unknown }) => { sources.set(id, { data: options.data, setData(data) { this.data = data; } }); },
    addLayer: (layer: typeof layers[number]) => layers.push(layer),
  };
  addPlanningOutline(map as unknown as Parameters<typeof addPlanningOutline>[0], route.metadata.planning_outline);
  assert.deepEqual(layers.find(l => l.id === 'peak-planning-line')?.paint['line-dasharray'], [3, 3]);
  assert.equal(layers.length, 2);
  addPlanningOutline(map as unknown as Parameters<typeof addPlanningOutline>[0], []);
  assert.equal(layers.length, 2);
  assert.deepEqual(sources.get('peak-planning-outline')?.data, { type: 'FeatureCollection', features: [] });
});
