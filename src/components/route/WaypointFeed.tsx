'use client';

import { useRouteWaypoints } from '@/hooks/useRouteWaypoints';
import WaypointCard from './WaypointCard';
import ElevationProfile from './ElevationProfile';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function WaypointFeed() {
  const { data, loading, error } = useRouteWaypoints();

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error || !data) {
    return (
      <p className="text-2xs text-neutral-600 font-mono">ROUTE DATA UNAVAILABLE</p>
    );
  }

  const sorted = [...data.waypoints].sort(
    (a, b) => (a.distance_from_start_km ?? 0) - (b.distance_from_start_km ?? 0)
  );

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-px bg-neutral-900 border border-neutral-900">
        {[
          { label: 'DISTANCE', value: `${data.metadata.total_distance_km} km` },
          { label: 'GAIN', value: `${data.metadata.total_gain_m} m` },
          { label: 'SUMMIT', value: `${data.metadata.summit_elevation_m} m` },
        ].map((stat) => (
          <div key={stat.label} className="bg-amoled px-2 py-1.5">
            <p className="text-2xs text-neutral-600 font-mono tracking-widest">{stat.label}</p>
            <p className="text-xs text-neon-cyan font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      <ElevationProfile waypoints={sorted} />

      <div>
        {sorted.map((wp, i) => (
          <WaypointCard key={wp.id} waypoint={wp} prevWaypoint={sorted[i - 1] ?? null} />
        ))}
      </div>
    </div>
  );
}
