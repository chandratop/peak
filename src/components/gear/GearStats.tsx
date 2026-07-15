'use client';

import { useMemo } from 'react';
import type { GearItem } from '@/types/gear';
import { formatWeight, totalWeight } from '@/lib/weightUtils';

interface GearStatsProps {
  items: GearItem[];
}

export default function GearStats({ items }: GearStatsProps) {
  const stats = useMemo(() => {
    const packed = items.filter((i) => i.status === 'packed');
    const criticalUnpacked = items.filter(
      (i) => i.priority === 'critical' && i.status === 'pending'
    );
    const total = totalWeight(items);
    const packedW = totalWeight(packed);
    const packedPct = items.length > 0 ? Math.round((packed.length / items.length) * 100) : 0;

    return { total, packedW, packedPct, criticalUnpacked: criticalUnpacked.length };
  }, [items]);

  const cells = [
    { label: 'TOTAL WEIGHT', value: formatWeight(stats.total) },
    { label: 'PACKED WEIGHT', value: formatWeight(stats.packedW) },
    { label: 'PACKED', value: `${stats.packedPct}%` },
    { label: 'CRITICAL NEEDED', value: String(stats.criticalUnpacked), alert: stats.criticalUnpacked > 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 mb-4">
      {cells.map((cell) => (
        <div key={cell.label} className="bg-amoled px-3 py-2">
          <p className="text-2xs text-neutral-600 font-mono tracking-widest mb-0.5">
            {cell.label}
          </p>
          <p
            className={`text-sm font-mono font-light ${
              cell.alert ? 'text-neon-orange' : 'text-neon-orange'
            }`}
          >
            {cell.value}
          </p>
        </div>
      ))}
    </div>
  );
}
