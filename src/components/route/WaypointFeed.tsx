'use client';

import { useRouteWaypoints } from '@/hooks/useRouteWaypoints';
import { useMapContext } from '@/lib/mapContext';
import WaypointCard from './WaypointCard';
import ElevationProfile from './ElevationProfile';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { MapPin, Triangle } from 'lucide-react';

export default function WaypointFeed() {
  const { data, loading, error } = useRouteWaypoints();
  const { panelState, mapRef } = useMapContext();

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error || !data) {
    return (
      <p className="text-2xs text-neutral-600 font-mono">ROUTE DATA UNAVAILABLE</p>
    );
  }

  const sorted = [...data.waypoints].sort(
    (a, b) => (a.distance_from_start_km ?? 0) - (b.distance_from_start_km ?? 0)
  );

  const summaryStats = (
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
  );

  if (panelState !== 'expanded') {
    // Compact — elevation profile + name/elevation rows only
    return (
      <div>
        {summaryStats}
        <ElevationProfile waypoints={sorted} />
        <div>
          {sorted.map((wp) => {
            const isSummit = wp.camp_type === 'summit';
            const isHighCamp = wp.camp_type === 'highcamp';
            return (
              <button
                key={wp.id}
                onClick={() => mapRef.current?.flyTo({
                  center: [wp.lng, wp.lat],
                  zoom: 14,
                  pitch: 60,
                  bearing: -20,
                  duration: 1800,
                })}
                className="w-full text-left flex items-center justify-between py-1.5 px-2 border-b border-neutral-900 hover:bg-neutral-950 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isSummit ? (
                    <Triangle size={8} className="flex-shrink-0 text-neon-orange fill-neon-orange" />
                  ) : (
                    <MapPin size={8} className={`flex-shrink-0 ${isHighCamp ? 'text-neon-orange' : 'text-neon-cyan'}`} />
                  )}
                  <span className="text-xs font-mono text-white truncate group-hover:text-neon-cyan transition-colors">
                    {wp.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-neon-orange tabular-nums flex-shrink-0 ml-2">
                  {wp.elevation_m}m
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Expanded — full waypoint cards with segment metrics
  return (
    <div>
      {summaryStats}
      <ElevationProfile waypoints={sorted} />
      <div>
        {sorted.map((wp, i) => (
          <WaypointCard key={wp.id} waypoint={wp} prevWaypoint={sorted[i - 1] ?? null} />
        ))}
      </div>
    </div>
  );
}
