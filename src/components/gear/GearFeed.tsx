'use client';

import { useState, useMemo } from 'react';
import { useGearManifest } from '@/hooks/useGearManifest';
import { useMapContext } from '@/lib/mapContext';
import type { GearCategory, GearStatus } from '@/types/gear';
import { formatWeight, totalWeight } from '@/lib/weightUtils';
import GearStats from './GearStats';
import GearFilters from './GearFilters';
import GearItem from './GearItem';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function GearFeed() {
  const { items, loading, error } = useGearManifest();
  const { panelState } = useMapContext();
  const [activeCategory, setActiveCategory] = useState<GearCategory | null>(null);
  const [activeStatus, setActiveStatus] = useState<GearStatus | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (activeStatus && item.status !== activeStatus) return false;
      return true;
    });
  }, [items, activeCategory, activeStatus]);

  const filteredWeight = useMemo(() => totalWeight(filtered), [filtered]);
  const isFiltered = activeCategory !== null || activeStatus !== null;

  if (loading) return <LoadingSkeleton rows={6} className="mb-4" />;
  if (error) {
    return (
      <p className="text-2xs text-neutral-600 font-mono mb-4">
        GEAR DATA UNAVAILABLE
      </p>
    );
  }

  return (
    <div>
      <GearStats items={items} />
      <GearFilters
        activeCategory={activeCategory}
        activeStatus={activeStatus}
        onCategoryChange={setActiveCategory}
        onStatusChange={setActiveStatus}
      />

      {/* Filtered weight tally — shows whenever a filter is active */}
      {isFiltered && (
        <div className="flex items-center justify-between px-2 py-1.5 mb-2 border border-neutral-800 bg-neutral-950">
          <span className="text-2xs font-mono text-neutral-600 tracking-widest uppercase">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} selected
          </span>
          <span className="text-xs font-mono text-neon-cyan tabular-nums">
            {formatWeight(filteredWeight)}
          </span>
        </div>
      )}

      {/* Item list — only shown in expanded mode */}
      {panelState === 'expanded' && (
        <div>
          {filtered.map((item, i) => (
            <GearItem key={`${item.item_name}-${i}`} item={item} />
          ))}
          {filtered.length === 0 && (
            <p className="text-2xs text-neutral-700 font-mono py-3 text-center tracking-widest">
              NO ITEMS MATCH FILTER
            </p>
          )}
        </div>
      )}
    </div>
  );
}
