import Papa from 'papaparse';
import type { GearItem } from '@/types/gear';
import type { RouteWaypointsFile } from '@/types/route';
import type { ItineraryDay } from '@/types/itinerary';

const categories = ['clothing', 'shelter', 'navigation', 'food', 'medical', 'technical', 'electronics', 'misc'];
const placements = ['yes', 'no', 'all but one'];
const itineraryTypes = ['drive', 'trek', 'mixed', 'mountaineering'];
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
export function parseGear(text: string): GearItem[] {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: 'greedy' });
  if (result.errors.length) throw new Error('Invalid gear CSV: ' + result.errors[0].message);
  const required = ['item_name', 'category', 'weight_g', 'qty', 'status', 'priority', 'in_rucksack'];
  if (!required.every(key => result.meta.fields?.includes(key))) throw new Error('Gear CSV is missing required columns');
  return result.data.map((row, index) => {
    const weight = Number(row.weight_g), qty = Number(row.qty);
    if (!row.item_name?.trim() || !categories.includes(row.category) || !row.weight_g?.trim() || !finite(weight) || weight < 0 || !row.qty?.trim() || !Number.isInteger(qty) || qty < 1 || !['packed', 'pending'].includes(row.status) || !['critical', 'optional'].includes(row.priority) || !placements.includes(row.in_rucksack)) throw new Error(`Invalid gear values on row ${index + 2}`);
    return { ...row, item_name: row.item_name.trim(), weight_g: weight, qty } as unknown as GearItem;
  });
}
export function parseWaypoints(value: unknown): RouteWaypointsFile {
  const data = value as RouteWaypointsFile;
  if (!data || !data.metadata || !Array.isArray(data.waypoints) || !data.waypoints.length) throw new Error('Route must contain metadata and waypoints');
  const m = data.metadata;
  if (![m.route_name, m.peak_name, m.region].every(v => typeof v === 'string' && v.trim()) || ![m.summit_elevation_m, m.total_distance_km, m.total_gain_m].every(finite) || m.total_distance_km < 0 || m.total_gain_m < 0) throw new Error('Invalid route metadata');
  if (m.coverage !== undefined && m.coverage !== 'approach-only') throw new Error('Invalid route coverage');
  if (m.route_note !== undefined && typeof m.route_note !== 'string') throw new Error('Invalid route note');
  if (m.planning_outline !== undefined) {
    if (m.coverage !== 'approach-only' || !m.route_note || !Array.isArray(m.planning_outline) || m.planning_outline.length < 2 || m.planning_outline.some(p => !p || typeof p.name !== 'string' || !p.name.trim() || !finite(p.lng) || Math.abs(p.lng) > 180 || !finite(p.lat) || Math.abs(p.lat) > 90)) throw new Error('Invalid planning outline');
  }
  const ids = new Set<string>();
  const distances = new Set<number>();
  for (const w of data.waypoints) {
    if (!w || typeof w.id !== 'string' || !w.id.trim() || ids.has(w.id) || typeof w.name !== 'string' || !w.name.trim() || !finite(w.lat) || Math.abs(w.lat) > 90 || !finite(w.lng) || Math.abs(w.lng) > 180 || !finite(w.elevation_m) || !finite(w.distance_from_start_km) || w.distance_from_start_km < 0 || distances.has(w.distance_from_start_km) || !['basecamp', 'camp', 'highcamp', 'summit', 'waypoint'].includes(w.camp_type) || (w.description !== undefined && typeof w.description !== 'string')) throw new Error('Invalid waypoint or duplicate ID/distance');
    for (const grade of [w.min_grade_pct, w.max_grade_pct]) if (grade !== undefined && !finite(grade)) throw new Error('Invalid waypoint grade');
    if (w.min_grade_pct !== undefined && w.max_grade_pct !== undefined && w.min_grade_pct > w.max_grade_pct) throw new Error('Invalid grade range');
    ids.add(w.id); distances.add(w.distance_from_start_km);
  }
  return data;
}
export function parseItinerary(text: string): ItineraryDay[] {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: 'greedy' });
  if (result.errors.length) throw new Error('Invalid itinerary CSV: ' + result.errors[0].message);
  const required = ['day', 'date', 'route', 'altitude_m', 'type', 'duration', 'accommodation', 'network', 'notes'];
  if (!required.every(key => result.meta.fields?.includes(key))) throw new Error('Itinerary CSV is missing required columns');
  const days = new Set<number>();
  return result.data.map((row, index) => {
    const day = Number(row.day);
    const altitude = row.altitude_m?.trim() ? Number(row.altitude_m) : undefined;
    if (!row.day?.trim() || !Number.isInteger(day) || day < 1 || days.has(day) || !/^\d{4}-\d{2}-\d{2}$/.test(row.date ?? '') || Number.isNaN(Date.parse(row.date)) || !row.route?.trim() || (altitude !== undefined && (!finite(altitude) || altitude < 0)) || !itineraryTypes.includes(row.type) || !row.duration?.trim() || !row.accommodation?.trim() || !row.network?.trim()) throw new Error(`Invalid itinerary values on row ${index + 2}`);
    days.add(day);
    return { ...row, day, altitude_m: altitude, route: row.route.trim(), notes: row.notes?.trim() || undefined } as unknown as ItineraryDay;
  });
}
