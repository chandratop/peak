'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import Divider from '@/components/ui/Divider';
import GearFeed from '@/components/gear/GearFeed';
import WaypointFeed from '@/components/route/WaypointFeed';
import { useExpedition } from '@/lib/expeditionContext';
import { useMapContext } from '@/lib/mapContext';

export default function LeftPanel() {
  const expedition = useExpedition();
  const { panelState } = useMapContext();
  const expanded = panelState === 'expanded';

  return (
    <div className="flex flex-col h-full px-4 py-4">
      {/* Header */}
      <div className="mb-5 flex-shrink-0">
        <p className="text-2xs tracking-[0.3em] text-neutral-600 uppercase font-mono mb-1">
          EXPEDITION DASHBOARD
        </p>
        <h1 className="text-white font-mono text-sm tracking-widest uppercase">
          {expedition.peakName}
          <span className="text-neon-orange ml-2 text-xs">{expedition.elevationM}m</span>
        </h1>
        <p className="text-neutral-600 text-2xs font-mono mt-0.5">
          {expedition.region}
        </p>
      </div>

      <Divider className="mb-5 flex-shrink-0" />

      {expanded ? (
        /* Two-column layout when expanded */
        <div className="flex flex-1 gap-0 min-h-0 overflow-y-auto">
          <div className="flex-1 min-w-0 pr-4 overflow-y-auto">
            <SectionHeader label="Gear Manifest" accent="orange" />
            <GearFeed />
          </div>
          <div className="w-px bg-neutral-900 flex-shrink-0" />
          <div className="flex-1 min-w-0 pl-4 pb-6 overflow-y-auto">
            <SectionHeader label="Route Waypoints" accent="cyan" />
            <WaypointFeed />
          </div>
        </div>
      ) : (
        /* Single-column layout when normal */
        <div className="flex-1 overflow-y-auto">
          <div className="flex-shrink-0">
            <SectionHeader label="Gear Manifest" accent="orange" />
            <GearFeed />
          </div>
          <Divider className="my-5" />
          <div className="flex-shrink-0 pb-6">
            <SectionHeader label="Route Waypoints" accent="cyan" />
            <WaypointFeed />
          </div>
        </div>
      )}
    </div>
  );
}
