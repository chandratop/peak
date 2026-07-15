'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { MapContext, type MapStyleMode, type PanelState } from '@/lib/mapContext';
import { ExpeditionContext } from '@/lib/expeditionContext';
import type { Expedition } from '@/lib/expeditions';

interface SplitLayoutProps {
  children: [ReactNode, ReactNode];
  expedition: Expedition;
}

const PANEL_WIDTH: Record<PanelState, string> = {
  normal:    'w-[400px]',
  expanded:  'w-[72%]',
  collapsed: 'w-0',
};

const PANEL_BG: Record<PanelState, string> = {
  normal:    'bg-black/90',
  expanded:  'bg-black/75 backdrop-blur-md',
  collapsed: 'bg-transparent',
};

export default function SplitLayout({ children, expedition }: SplitLayoutProps) {
  const mapRef = useRef<MapboxMap | null>(null);
  const [panelState, setPanelState] = useState<PanelState>('normal');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('wireframe');

  const handleCollapseTab = () => {
    setPanelState((s) => (s === 'collapsed' ? 'normal' : 'collapsed'));
  };

  const handleExpandToggle = () => {
    setPanelState((s) => (s === 'expanded' ? 'normal' : 'expanded'));
  };

  return (
    <ExpeditionContext.Provider value={expedition}>
      <MapContext.Provider value={{ mapRef, mapStyle, setMapStyle, panelState }}>
        <div className="relative h-screen w-screen overflow-hidden bg-amoled min-w-[1024px]">

          {/* Map — always fills the full viewport */}
          <div className="absolute inset-0">
            {children[1]}
          </div>

          {/* Panel — floats over the map */}
          <div
            className={`
              absolute top-0 left-0 h-full z-10
              border-r border-neutral-900
              overflow-hidden
              transition-[width] duration-300 ease-in-out
              ${PANEL_WIDTH[panelState]}
              ${PANEL_BG[panelState]}
            `}
          >
            <div
              className={`
                h-full overflow-y-auto
                transition-opacity duration-200
                ${panelState === 'collapsed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
            >
              {children[0]}
            </div>

            {panelState !== 'collapsed' && (
              <button
                onClick={handleExpandToggle}
                className="absolute top-3 right-8 z-20 flex items-center justify-center w-5 h-5 border border-neutral-800 bg-black/60 hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
                aria-label={panelState === 'expanded' ? 'Minimize panel' : 'Expand panel'}
              >
                {panelState === 'expanded' ? (
                  <Minimize2 size={9} className="text-neutral-500" />
                ) : (
                  <Maximize2 size={9} className="text-neutral-500" />
                )}
              </button>
            )}

            <button
              onClick={handleCollapseTab}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20 flex items-center justify-center w-4 h-10 bg-black/80 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
              aria-label={panelState === 'collapsed' ? 'Show panel' : 'Hide panel'}
            >
              {panelState === 'collapsed' ? (
                <ChevronRight size={10} className="text-neutral-500" />
              ) : (
                <ChevronLeft size={10} className="text-neutral-500" />
              )}
            </button>
          </div>

        </div>
      </MapContext.Provider>
    </ExpeditionContext.Provider>
  );
}
