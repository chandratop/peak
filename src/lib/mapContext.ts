import { createContext, useContext, type MutableRefObject } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

export type MapStyleMode = 'wireframe' | 'satellite' | 'topo';
export type PanelState = 'normal' | 'expanded' | 'collapsed';

interface MapContextValue {
  mapRef: MutableRefObject<MapboxMap | null>;
  mapStyle: MapStyleMode;
  setMapStyle: (mode: MapStyleMode) => void;
  panelState: PanelState;
}

export const MapContext = createContext<MapContextValue | null>(null);

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used inside MapContext.Provider');
  return ctx;
}
