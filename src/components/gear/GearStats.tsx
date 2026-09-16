'use client';

import { useMemo } from 'react';
import type { GearItem } from '@/types/gear';
import { formatWeight, totalWeight, rucksackWeight, nonRucksackWeight } from '@/lib/weightUtils';

interface GearStatsProps {
  items: GearItem[];
}

export default function GearStats({ items }: GearStatsProps) {
  const stats = useMemo(() => {
    const packed = items.filter((i) => i.status === 'packed');
    const total = totalWeight(items);
    const packedW = totalWeight(packed);
    const packedPct = items.length > 0 ? Math.round((packed.length / items.length) * 100) : 0;
    const rucksackW = rucksackWeight(items);
    const nonRucksackW = nonRucksackWeight(items);

    return { total, packedW, packedPct, rucksackW, nonRucksackW };
  }, [items]);

  const cells = [
    { label: 'TOTAL WEIGHT', value: formatWeight(stats.total) },
    { label: 'PACKED WEIGHT', value: formatWeight(stats.packedW) },
    { label: 'RUCKSACK WEIGHT', value: formatWeight(stats.rucksackW) },
    { label: 'NON-RUCKSACK WEIGHT', value: formatWeight(stats.nonRucksackW) },
    { label: 'ITEM TYPES PACKED', value: `${stats.packedPct}%` },
    { label: 'ITEMS', value: String(items.length) },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 mb-4">
      {cells.map((cell) => (
        <div key={cell.label} className="bg-amoled px-3 py-2">
          <p className="text-2xs text-neutral-600 font-mono tracking-widest mb-0.5">
            {cell.label}
          </p>
          <p
            className="text-sm font-mono font-light text-neon-orange"
          >
            {cell.value}
          </p>
        </div>
      ))}
    </div>
  );
}
