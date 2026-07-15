import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { EXPEDITIONS } from '@/lib/expeditions';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-amoled flex flex-col items-center justify-center px-6">

      {/* Wordmark */}
      <div className="mb-12 text-center">
        <h1 className="text-white font-mono text-2xl tracking-[0.5em] uppercase mb-2">
          PEAK
        </h1>
        <p className="text-neutral-600 font-mono text-2xs tracking-[0.3em] uppercase">
          Mountaineering Expedition Dashboard
        </p>
      </div>

      {/* Expedition list */}
      <div className="w-full max-w-sm space-y-px">
        <p className="text-neutral-700 font-mono text-2xs tracking-widest uppercase mb-3">
          Expeditions
        </p>
        {EXPEDITIONS.map((e) => (
          <Link
            key={e.slug}
            href={`/${e.slug}`}
            className="group flex items-center justify-between w-full px-4 py-3 border border-neutral-900 hover:border-neon-orange/40 bg-black/60 hover:bg-neutral-950 transition-colors"
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono text-white tracking-widest uppercase group-hover:text-neon-orange transition-colors">
                  {e.peakName}
                </span>
                <span className="text-xs font-mono text-neon-orange tabular-nums">
                  {e.elevationM}m
                </span>
              </div>
              <p className="text-2xs font-mono text-neutral-600 mt-0.5">
                {e.region}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="text-neutral-700 group-hover:text-neon-orange transition-colors flex-shrink-0"
            />
          </Link>
        ))}
      </div>

    </div>
  );
}
