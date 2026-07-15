'use client';

import type { GearCategory, GearStatus } from '@/types/gear';

const CATEGORIES: GearCategory[] = [
  'clothing', 'shelter', 'technical', 'navigation', 'medical', 'food', 'electronics', 'misc',
];

const STATUSES: GearStatus[] = ['packed', 'needed'];

interface GearFiltersProps {
  activeCategory: GearCategory | null;
  activeStatus: GearStatus | null;
  onCategoryChange: (cat: GearCategory | null) => void;
  onStatusChange: (status: GearStatus | null) => void;
}

function Pill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: 'orange' | 'cyan';
  onClick: () => void;
}) {
  const activeClass =
    color === 'orange'
      ? 'border-neon-orange/60 text-neon-orange'
      : 'border-neon-cyan/60 text-neon-cyan';
  return (
    <button
      onClick={onClick}
      className={`text-2xs font-mono tracking-widest uppercase px-2 py-0.5 border transition-colors ${
        active ? activeClass : 'border-neutral-800 text-neutral-600 hover:border-neutral-700 hover:text-neutral-500'
      }`}
    >
      {label}
    </button>
  );
}

export default function GearFilters({
  activeCategory,
  activeStatus,
  onCategoryChange,
  onStatusChange,
}: GearFiltersProps) {
  return (
    <div className="space-y-2 mb-3">
      <div className="flex flex-wrap gap-1">
        {STATUSES.map((s) => (
          <Pill
            key={s}
            label={s}
            active={activeStatus === s}
            color={s === 'packed' ? 'cyan' : 'orange'}
            onClick={() => onStatusChange(activeStatus === s ? null : s)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            label={c}
            active={activeCategory === c}
            color="cyan"
            onClick={() => onCategoryChange(activeCategory === c ? null : c)}
          />
        ))}
      </div>
    </div>
  );
}
