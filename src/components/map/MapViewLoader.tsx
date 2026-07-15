'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-neutral-800 text-2xs font-mono tracking-[0.3em] uppercase animate-pulse">
        INITIALIZING MAP
      </span>
    </div>
  ),
});

export default function MapViewLoader() {
  return <MapView />;
}
