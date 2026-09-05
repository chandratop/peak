import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseGear, parseWaypoints } from '../src/lib/dataValidation';
import { computeSegmentMetrics } from '../src/lib/routeUtils';
import { totalWeight } from '../src/lib/weightUtils';

const gear = readFileSync('public/data/kalanag/gear-manifest.csv', 'utf8');
const route = JSON.parse(readFileSync('public/data/kalanag/route-waypoints.json', 'utf8'));
test('shipped data validates and weights include quantities', () => {
  assert.equal(parseWaypoints(route).waypoints.length, 7);
  assert.equal(parseGear(gear).length, 30);
  assert.equal(totalWeight([{ weight_g: 100, qty: 3 }]), 300);
});
test('invalid CSV enums, quantities, weights and headers are rejected', () => {
  for (const bad of [gear.replace('650,1', '650,0'), gear.replace('650,1', '-1,1'), gear.replace('packed,critical', 'confirmed,critical'), gear.replace('weight_g', 'weight')]) assert.throws(() => parseGear(bad));
});
test('duplicate distances and invalid coordinates are rejected', () => {
  const invalid = structuredClone(route); invalid.waypoints[1].distance_from_start_km = 0;
  assert.throws(() => parseWaypoints(invalid));
  invalid.waypoints[1].distance_from_start_km = 12; invalid.waypoints[0].lat = 100;
  assert.throws(() => parseWaypoints(invalid));
});
test('segment estimates account for ascent and reject non-increasing distances', () => {
  const [a, b] = route.waypoints;
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
  assert.equal(parseGpxTrack(xml).geometry.type, 'LineString');
  const segment = '<trkseg><trkpt lat="30" lon="78"/><trkpt lat="31" lon="79"/></trkseg>';
  assert.equal(parseGpxTrack(`<gpx><trk>${segment}${segment}</trk></gpx>`).geometry.type, 'MultiLineString');
  assert.throws(() => parseGpxTrack('<gpx/>'));
});
