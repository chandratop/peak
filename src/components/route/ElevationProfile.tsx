'use client';

import type { Waypoint } from '@/types/route';

interface ElevationProfileProps {
  waypoints: Waypoint[];
}

export default function ElevationProfile({ waypoints }: ElevationProfileProps) {
  if (waypoints.length < 2) return null;

  const sorted = [...waypoints].sort(
    (a, b) => (a.distance_from_start_km ?? 0) - (b.distance_from_start_km ?? 0)
  );

  const WIDTH = 280;
  const HEIGHT = 48;
  const PADDING = 4;

  const minElev = Math.min(...sorted.map((w) => w.elevation_m));
  const maxElev = Math.max(...sorted.map((w) => w.elevation_m));
  const elevRange = maxElev - minElev || 1;

  const maxDist = sorted[sorted.length - 1].distance_from_start_km ?? sorted.length - 1;

  const toX = (dist: number) =>
    PADDING + ((dist / maxDist) * (WIDTH - PADDING * 2));
  const toY = (elev: number) =>
    HEIGHT - PADDING - (((elev - minElev) / elevRange) * (HEIGHT - PADDING * 2));

  const points = sorted
    .map((w) => `${toX(w.distance_from_start_km ?? 0)},${toY(w.elevation_m)}`)
    .join(' ');

  return (
    <div className="mb-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ height: 48 }}
        aria-label="Elevation profile"
      >
        <polyline
          points={points}
          fill="none"
          stroke="rgb(64 64 64)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {sorted.map((w) => (
          <circle
            key={w.id}
            cx={toX(w.distance_from_start_km ?? 0)}
            cy={toY(w.elevation_m)}
            r={w.camp_type === 'summit' ? 3 : 2}
            fill={w.camp_type === 'summit' || w.camp_type === 'highcamp' ? '#ff6b2b' : '#00d4ff'}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-0.5">
        <span className="text-2xs text-neutral-700 font-mono">
          {sorted[0].elevation_m}m
        </span>
        <span className="text-2xs text-neon-orange font-mono">
          ▲ {maxElev}m
        </span>
      </div>
    </div>
  );
}
