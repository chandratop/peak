'use client';

import { useRouteWaypoints } from '@/hooks/useRouteWaypoints';
import { useMapContext } from '@/lib/mapContext';
import WaypointCard from './WaypointCard';
import ElevationProfile from './ElevationProfile';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { MapPin, Triangle } from 'lucide-react';

export default function WaypointFeed() {
  const { data, loading, error } = useRouteWaypoints();
  const { panelState, focusWaypoint } = useMapContext();

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error || !data) {
    return (
      <p className="text-2xs text-neutral-600 font-mono">ROUTE DATA UNAVAILABLE: {error ?? 'No waypoints found'}</p>
    );
  }

  const sorted = [...data.waypoints].sort(
    (a, b) => (a.distance_from_start_km ?? 0) - (b.distance_from_start_km ?? 0)
  );

  const summaryStats = (
    <>
    {data.metadata.route_note && <div className="mb-3 border border-neon-cyan/30 p-3 text-xs text-neutral-300">
      <p className="text-neon-cyan mb-1">Planning overview · not for navigation</p>
      <p>{data.metadata.route_note}</p>
      <p className="mt-2 text-neutral-400">Totals below cover Taluka → Ruinsara only. GPX ascent includes elevation fluctuations.</p>
      <a href="https://www.cicerone.co.uk/trekking-in-the-indian-himalayas" target="_blank" rel="noreferrer" className="underline block mt-2">Approach: Cicerone / Brian Furze</a>
      <a href="https://www.openstreetmap.org/node/7673848541" target="_blank" rel="noreferrer" className="underline block mt-1">Kyarkoti locality: © OpenStreetMap contributors</a>
    </div>}
    <div className="mb-3 grid grid-cols-3 gap-px bg-neutral-900 border border-neutral-900">
      {[
        { label: data.metadata.coverage ? 'APPROACH' : 'DISTANCE', value: `${data.metadata.total_distance_km} km` },
        { label: data.metadata.coverage ? 'GPX ASCENT' : 'GAIN', value: `${data.metadata.total_gain_m} m` },
        { label: 'SUMMIT', value: `${data.metadata.summit_elevation_m} m` },
      ].map((stat) => (
        <div key={stat.label} className="bg-amoled px-2 py-1.5">
          <p className="text-2xs text-neutral-600 font-mono tracking-widest">{stat.label}</p>
          <p className="text-xs text-neon-cyan font-mono">{stat.value}</p>
        </div>
      ))}
    </div>
    {data.metadata.planning_outline && <div className="mb-4">
      <p className="text-2xs text-neutral-400 mb-1">Beyond the supplied track · approximate locations</p>
      {data.metadata.planning_outline.slice(1).map(point => <button key={point.name} onClick={() => focusWaypoint(point.lng, point.lat)} className="min-h-11 w-full text-left text-xs text-neon-cyan border-b border-dashed border-neutral-700">{point.name} ↗</button>)}
      <p className="text-2xs text-neutral-400 mt-2">Kyarkoti is an area marker, not a confirmed campsite. Camp 1–3 positions await Discovery Hike’s track.</p>
    </div>}
    </>
  );

  if (panelState !== 'expanded') {
    // Compact — elevation profile + name/elevation rows only
    return (
      <div>
        {summaryStats}
        <ElevationProfile waypoints={sorted} />
        <p className="text-2xs text-neutral-400 mb-3">Slopes and elevation changes use waypoint endpoints. Times are estimates; slope labels do not rate climbing difficulty.</p>
        <div>
          {sorted.map((wp) => {
            const isSummit = wp.camp_type === 'summit';
            const isHighCamp = wp.camp_type === 'highcamp';
            return (
              <button
                key={wp.id}
                onClick={() => focusWaypoint(wp.lng, wp.lat)}
                className="min-h-11 md:min-h-0 w-full text-left flex items-center justify-between py-1.5 px-2 border-b border-neutral-900 hover:bg-neutral-950 transition-colors group"
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
        <p className="text-2xs text-neutral-400 mb-3">Slopes and elevation changes use waypoint endpoints. Times are estimates; slope labels do not rate climbing difficulty.</p>
      <div>
        {sorted.map((wp, i) => (
          <WaypointCard key={wp.id} waypoint={wp} prevWaypoint={sorted[i - 1] ?? null} />
        ))}
      </div>
    </div>
  );
}
