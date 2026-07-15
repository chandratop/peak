import type { Waypoint } from '@/types/route';

export type EffortLabel = 'TRAIL' | 'STEEP' | 'SCRAMBLE' | 'TECHNICAL';

export interface SegmentMetrics {
  distance_km: number;
  elevation_gain_m: number;  // signed: positive = ascent, negative = descent
  avg_grade_pct: number;
  avg_angle_deg: number;
  naismith_hours: number;
  effort_label: EffortLabel;
}

export function gradeToEffortLabel(grade: number): EffortLabel {
  if (grade < 15)  return 'TRAIL';
  if (grade < 35)  return 'STEEP';
  if (grade < 60)  return 'SCRAMBLE';
  return 'TECHNICAL';
}

export function computeSegmentMetrics(from: Waypoint, to: Waypoint): SegmentMetrics {
  const distance_km =
    (to.distance_from_start_km ?? 0) - (from.distance_from_start_km ?? 0);
  const elevation_gain_m = to.elevation_m - from.elevation_m;

  const distance_m = distance_km * 1000;
  const avg_grade_pct =
    distance_m > 0 ? (elevation_gain_m / distance_m) * 100 : 0;
  const avg_angle_deg =
    distance_m > 0
      ? (Math.atan2(elevation_gain_m, distance_m) * 180) / Math.PI
      : 0;

  // Naismith's Rule: 5 km/hr on flat + 600 m/hr ascent (descent adds negligible time)
  const naismith_hours =
    distance_km / 5 + Math.max(0, elevation_gain_m) / 600;

  return {
    distance_km,
    elevation_gain_m,
    avg_grade_pct: Math.round(avg_grade_pct * 10) / 10,
    avg_angle_deg: Math.round(avg_angle_deg * 10) / 10,
    naismith_hours: Math.round(naismith_hours * 10) / 10,
    effort_label: gradeToEffortLabel(Math.abs(avg_grade_pct)),
  };
}
