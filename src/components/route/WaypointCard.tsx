'use client';

import { MapPin, Triangle } from 'lucide-react';
import type { Waypoint } from '@/types/route';
import type { EffortLabel } from '@/lib/routeUtils';
import { computeSegmentMetrics } from '@/lib/routeUtils';
import { useMapContext } from '@/lib/mapContext';

interface WaypointCardProps {
  waypoint: Waypoint;
  prevWaypoint?: Waypoint | null;
}

const CAMP_LABELS: Record<string, string> = {
  basecamp: 'BC',
  camp: 'CAMP',
  highcamp: 'HC',
  summit: 'SUMMIT',
  waypoint: 'WPT',
};

const EFFORT_STYLES: Record<EffortLabel, string> = {
  TRAIL:     'border-neutral-700 text-neutral-500',
  STEEP:     'border-neon-cyan/40 text-neon-cyan/70',
  SCRAMBLE:  'border-neon-orange/40 text-neon-orange/80',
  TECHNICAL: 'border-neon-orange text-neon-orange',
};

export default function WaypointCard({ waypoint, prevWaypoint }: WaypointCardProps) {
  const { mapRef } = useMapContext();

  const handleClick = () => {
    mapRef.current?.flyTo({
      center: [waypoint.lng, waypoint.lat],
      zoom: 14,
      pitch: 60,
      bearing: -20,
      duration: 1800,
    });
  };

  const isSummit = waypoint.camp_type === 'summit';
  const isHighCamp = waypoint.camp_type === 'highcamp';
  const seg = prevWaypoint ? computeSegmentMetrics(prevWaypoint, waypoint) : null;

  const gainSign = seg && seg.elevation_gain_m >= 0 ? '+' : '';
  const gainColor = seg && seg.elevation_gain_m >= 0 ? 'text-neon-cyan/80' : 'text-neutral-500';

  return (
    <button
      onClick={handleClick}
      className="w-full text-left py-2 px-2 border-b border-neutral-900 hover:bg-neutral-950 transition-colors group"
      aria-label={`Fly to ${waypoint.name}`}
    >
      {/* Waypoint header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div className="mt-0.5 flex-shrink-0">
            {isSummit ? (
              <Triangle size={10} className="text-neon-orange fill-neon-orange" />
            ) : (
              <MapPin size={10} className={isHighCamp ? 'text-neon-orange' : 'text-neon-cyan'} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white font-mono truncate group-hover:text-neon-cyan transition-colors">
              {waypoint.name}
            </p>
            {waypoint.description && (
              <p className="text-2xs text-neutral-600 font-mono mt-0.5 line-clamp-1">
                {waypoint.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-neon-orange font-mono tabular-nums">
            {waypoint.elevation_m}m
          </p>
          <p className="text-2xs text-neutral-700 font-mono tracking-widest">
            {CAMP_LABELS[waypoint.camp_type] ?? waypoint.camp_type.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Segment metrics row — only when there's a previous waypoint */}
      {seg && (
        <div className="mt-1.5 ml-4 space-y-1">
          {/* Primary metrics: distance, elevation, grade, effort, time */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
            <span className="text-2xs text-neutral-500 font-mono tabular-nums">
              ← {seg.distance_km.toFixed(1)} km
            </span>
            <span className={`text-2xs font-mono tabular-nums ${gainColor}`}>
              {gainSign}{seg.elevation_gain_m} m
            </span>
            <span className="text-2xs text-neutral-500 font-mono tabular-nums">
              ~{seg.avg_grade_pct.toFixed(0)}%
            </span>
            <span className="text-2xs text-neutral-500 font-mono tabular-nums">
              {seg.avg_angle_deg.toFixed(1)}°
            </span>
            <span
              className={`text-2xs font-mono tracking-widest px-1 py-px border ${EFFORT_STYLES[seg.effort_label]}`}
            >
              {seg.effort_label}
            </span>
            <span className="text-2xs text-neutral-600 font-mono tabular-nums">
              ≈{seg.naismith_hours.toFixed(1)} h
            </span>
          </div>

          {/* Grade range row — only if authored in JSON */}
          {waypoint.min_grade_pct != null && waypoint.max_grade_pct != null && (
            <p className="text-2xs text-neutral-700 font-mono">
              grade range&nbsp;
              <span className="text-neutral-500">
                [{waypoint.min_grade_pct}%–{waypoint.max_grade_pct}%]
              </span>
            </p>
          )}
        </div>
      )}
    </button>
  );
}
