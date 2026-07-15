'use client';

import { Globe, Layers, Satellite } from 'lucide-react';
import { useMapContext, type MapStyleMode } from '@/lib/mapContext';

const MODES: {
  id: MapStyleMode;
  label: string;
  sublabel: string;
  Icon: typeof Globe;
}[] = [
  { id: 'wireframe', label: 'WIRE',      sublabel: 'Dark',      Icon: Layers    },
  { id: 'satellite', label: 'SAT',       sublabel: 'Imagery',   Icon: Satellite },
  { id: 'topo',      label: 'TOPO',      sublabel: 'Terrain',   Icon: Globe     },
];

export default function MapStyleSwitcher() {
  const { mapStyle, setMapStyle } = useMapContext();

  return (
    <div className="absolute top-3 right-3 z-10 flex gap-1">
      {MODES.map(({ id, label, sublabel, Icon }) => {
        const active = mapStyle === id;
        return (
          <button
            key={id}
            onClick={() => setMapStyle(id)}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 border transition-colors ${
              active
                ? 'border-neon-cyan/60 bg-black/80 text-neon-cyan'
                : 'border-neutral-800 bg-black/60 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
            }`}
            aria-pressed={active}
            aria-label={`Switch to ${sublabel} map style`}
          >
            <Icon size={12} strokeWidth={active ? 2 : 1.5} />
            <span className="text-2xs font-mono tracking-widest leading-none">{label}</span>
            <span
              className={`text-2xs font-mono leading-none ${
                active ? 'text-neon-cyan/60' : 'text-neutral-700'
              }`}
            >
              {sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
