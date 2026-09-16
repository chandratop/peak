'use client';

import { useMemo } from 'react';
import { useItinerary } from '@/hooks/useItinerary';
import type { ItineraryDay, ItineraryDayType } from '@/types/itinerary';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

const TYPE_LABELS: Record<ItineraryDayType, string> = {
  drive: 'Drive',
  trek: 'Trek',
  mixed: 'Drive + Trek',
  mountaineering: 'Mountaineering',
};

const TYPE_STYLES: Record<ItineraryDayType, string> = {
  drive: 'border-neutral-700 text-neutral-400',
  trek: 'border-neon-cyan/40 text-neon-cyan/80',
  mixed: 'border-neon-cyan/40 text-neon-cyan/80',
  mountaineering: 'border-neon-orange/60 text-neon-orange',
};

function weekdayShort(date: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

export default function ItineraryFeed() {
  const { days, loading, error } = useItinerary();
  const sorted = useMemo(() => [...days].sort((a, b) => a.day - b.day), [days]);
  const stats = useMemo(() => {
    const count = (types: ItineraryDayType[]) => sorted.filter((d) => types.includes(d.type)).length;
    return {
      total: sorted.length,
      drive: count(['drive', 'mixed']),
      trek: count(['trek', 'mixed']),
      mountaineering: count(['mountaineering']),
    };
  }, [sorted]);

  if (loading) return <LoadingSkeleton rows={6} className="mb-4" />;
  if (error) {
    return (
      <p className="text-2xs text-neutral-600 font-mono mb-4">
        ITINERARY DATA UNAVAILABLE: {error}
      </p>
    );
  }
  if (!sorted.length) {
    return <p className="text-2xs text-neutral-700 font-mono py-3 text-center tracking-widest">NO ITINERARY DAYS FOUND</p>;
  }

  return (
    <div>
      <div className="mb-3 border border-neon-cyan/30 p-3 text-xs text-neutral-300">
        <p className="text-neon-cyan mb-1">Operator itinerary · confirm before departure</p>
        <p>Reconstructed from Discovery Hike&apos;s published Black Peak Expedition itinerary, mapped onto this trip&apos;s dates. Day 11 only happens if Day 10&apos;s summit attempt is weathered out.</p>
        <p className="mt-2 text-neutral-400">Network column is a general estimate for this trek corridor, not a claim from the operator.</p>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-px bg-neutral-900 border border-neutral-900">
        {[
          { label: 'DAYS', value: String(stats.total) },
          { label: 'DRIVE', value: String(stats.drive) },
          { label: 'TREK', value: String(stats.trek) },
          { label: 'MOUNTAINEERING', value: String(stats.mountaineering) },
        ].map((cell) => (
          <div key={cell.label} className="bg-amoled px-2 py-1.5">
            <p className="text-2xs text-neutral-600 font-mono tracking-widest">{cell.label}</p>
            <p className="text-xs text-neon-cyan font-mono tabular-nums">{cell.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border border-neutral-900 mb-3">
        <table className="w-full text-2xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-widest">
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Day</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Wk</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Date</th>
              <th className="text-left px-2 py-1.5">Route</th>
              <th className="text-right px-2 py-1.5 whitespace-nowrap">Alt</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Type</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Duration</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Stay</th>
              <th className="text-left px-2 py-1.5 whitespace-nowrap">Network</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d: ItineraryDay) => (
              <tr key={d.day} className="border-b border-neutral-900 hover:bg-neutral-950 transition-colors align-top">
                <td className="px-2 py-1.5 text-neutral-400 tabular-nums">{d.day}</td>
                <td className="px-2 py-1.5 text-neutral-500 whitespace-nowrap">{weekdayShort(d.date)}</td>
                <td className="px-2 py-1.5 text-neutral-400 tabular-nums whitespace-nowrap">{formatDate(d.date)}</td>
                <td className="px-2 py-1.5 text-white min-w-[9rem]">
                  {d.route}
                  {d.notes && <span className="block text-neutral-600 mt-0.5">{d.notes}</span>}
                </td>
                <td className="px-2 py-1.5 text-neon-orange tabular-nums text-right whitespace-nowrap">
                  {d.altitude_m != null ? `${d.altitude_m}m` : '—'}
                </td>
                <td className="px-2 py-1.5 whitespace-nowrap">
                  <span className={`inline-block text-2xs font-mono tracking-widest px-1.5 py-0.5 border ${TYPE_STYLES[d.type]}`}>
                    {TYPE_LABELS[d.type]}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-neutral-400 whitespace-nowrap">{d.duration}</td>
                <td className="px-2 py-1.5 text-neutral-400 whitespace-nowrap">{d.accommodation}</td>
                <td className="px-2 py-1.5 text-neutral-500 whitespace-nowrap">{d.network}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
