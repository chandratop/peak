'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { ChevronDown, ChevronUp, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { MapContext, type MapStyleMode, type PanelState } from '@/lib/mapContext';
import { ExpeditionContext } from '@/lib/expeditionContext';
import type { Expedition } from '@/lib/expeditions';

export default function SplitLayout({ children, expedition }: { children: [ReactNode, ReactNode]; expedition: Expedition }) {
  const collapseControlRef = useRef<HTMLButtonElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [panelState, setPanelState] = useState<PanelState>('normal');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('wireframe');
  const focusWaypoint = (lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, pitch: 60, bearing: -20, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1800 });
    if (window.matchMedia('(max-width: 767px)').matches) {
      setPanelState('collapsed');
      collapseControlRef.current?.focus({ preventScroll: true });
    }
  };
  return (
    <ExpeditionContext.Provider value={expedition}>
      <MapContext.Provider value={{ mapRef, mapStyle, setMapStyle, panelState, focusWaypoint }}>
        <main className="relative h-dvh w-full overflow-hidden bg-amoled">
          <div className="absolute inset-0">{children[1]}</div>
          <section aria-label="Expedition details" className={`dashboard-panel panel-${panelState}`}>
            <div className="flex items-center justify-between gap-2 border-b border-neutral-800 px-3 shrink-0 min-h-14">
              <span className="text-xs tracking-widest truncate">{expedition.peakName} <span className="text-neon-orange">{expedition.elevationM}m</span></span>
              <div className="flex shrink-0">
                <button className="panel-control" aria-label={panelState === 'expanded' ? 'Reduce details' : 'Expand details'} aria-expanded={panelState === 'expanded'} onClick={() => setPanelState(panelState === 'expanded' ? 'normal' : 'expanded')}>
                  {panelState === 'expanded' ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button ref={collapseControlRef} className="panel-control" aria-label={panelState === 'collapsed' ? 'Show details' : 'Hide details'} aria-expanded={panelState !== 'collapsed'} onClick={() => setPanelState(panelState === 'collapsed' ? 'normal' : 'collapsed')}>
                  <span className="md:hidden">{panelState === 'collapsed' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                  <span className="hidden md:block">{panelState === 'collapsed' ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</span>
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden" hidden={panelState === 'collapsed'}>{children[0]}</div>
          </section>
        </main>
      </MapContext.Provider>
    </ExpeditionContext.Provider>
  );
}
