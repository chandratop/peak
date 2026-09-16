'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import GearFeed from '@/components/gear/GearFeed';
import WaypointFeed from '@/components/route/WaypointFeed';
import ItineraryFeed from '@/components/itinerary/ItineraryFeed';
import { useExpedition } from '@/lib/expeditionContext';
import { useMapContext } from '@/lib/mapContext';

const TABS = ['route', 'itinerary', 'gear'] as const;

export default function LeftPanel() {
  const expedition = useExpedition();
  const { panelState } = useMapContext();
  const [tab, setTab] = useState<(typeof TABS)[number]>('route');
  return (
    <div className="flex flex-col h-full">
      <p className="px-4 py-2 text-xs text-neutral-400">{expedition.region}</p>
      <div className="flex px-3 gap-2 md:hidden" role="tablist" aria-label="Expedition information">
        {TABS.map((value, i) => <button key={value} role="tab" id={`${value}-tab`} aria-controls={`${value}-panel`} aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onKeyDown={(event) => {
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const currentIndex = TABS.indexOf(tab);
            const next = event.key === 'Home' ? TABS[0] : event.key === 'End' ? TABS[TABS.length - 1] : event.key === 'ArrowRight' ? TABS[(currentIndex + 1) % TABS.length] : TABS[(currentIndex - 1 + TABS.length) % TABS.length];
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
        <div id="itinerary-panel" className={`${tab !== 'itinerary' ? 'hidden md:block' : ''} min-w-0 pb-6 lg:col-span-2`}>
          <SectionHeader label="Itinerary" accent="cyan" /><ItineraryFeed />
        </div>
      </div>
    </div>
  );
}
