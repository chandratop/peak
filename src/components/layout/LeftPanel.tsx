'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import GearFeed from '@/components/gear/GearFeed';
import WaypointFeed from '@/components/route/WaypointFeed';
import { useExpedition } from '@/lib/expeditionContext';
import { useMapContext } from '@/lib/mapContext';

export default function LeftPanel() {
  const expedition = useExpedition();
  const { panelState } = useMapContext();
  const [tab, setTab] = useState<'route' | 'gear'>('route');
  return (
    <div className="flex flex-col h-full">
      <p className="px-4 py-2 text-xs text-neutral-400">{expedition.region}</p>
      <div className="flex px-3 gap-2 md:hidden" role="tablist" aria-label="Expedition information">
        {(['route', 'gear'] as const).map((value) => <button key={value} role="tab" id={`${value}-tab`} aria-controls={`${value}-panel`} aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onKeyDown={(event) => {
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const next = event.key === 'Home' ? 'route' : event.key === 'End' ? 'gear' : tab === 'route' ? 'gear' : 'route';
            setTab(next); document.getElementById(`${next}-tab`)?.focus();
          }
        }} className={`panel-control flex-1 uppercase text-xs ${tab === value ? 'text-neon-cyan border-b border-neon-cyan' : 'text-neutral-400'}`} onClick={() => setTab(value)}>{value}</button>)}
      </div>
      <div className={`detail-feeds flex-1 min-h-0 overflow-y-auto p-4 ${panelState === 'expanded' ? 'lg:grid lg:grid-cols-2 lg:gap-6' : ''}`}>
        <div id="gear-panel" className={`${tab !== 'gear' ? 'hidden md:block' : ''} min-w-0 mb-6`}>
          <SectionHeader label="Gear Manifest" accent="orange" /><GearFeed />
        </div>
        <div id="route-panel" className={`${tab !== 'route' ? 'hidden md:block' : ''} min-w-0 pb-6`}>
          <SectionHeader label="Route Waypoints" accent="cyan" /><WaypointFeed />
        </div>
      </div>
    </div>
  );
}
