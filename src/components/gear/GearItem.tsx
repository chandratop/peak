import type { GearItem as GearItemType } from '@/types/gear';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatWeight } from '@/lib/weightUtils';

interface GearItemProps {
  item: GearItemType;
}

export default function GearItem({ item }: GearItemProps) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 px-2 border-b border-neutral-900 hover:bg-neutral-950 transition-colors ${
        item.priority === 'critical' && item.status === 'pending'
          ? 'border-l border-l-neon-orange/30'
          : ''
      }`}
    >
      <div className="flex-1 min-w-0 mr-2">
        <p className="text-xs text-white font-mono truncate">{item.item_name}</p>
        <p className="text-2xs text-neutral-600 font-mono uppercase tracking-widest">
          {item.category}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-2xs text-neutral-500 font-mono tabular-nums">
          ×{item.qty}
        </span>
        <span className="text-2xs text-neutral-400 font-mono tabular-nums w-14 text-right">
          {formatWeight(item.weight_g * item.qty)}
        </span>
        <StatusBadge status={item.status} priority={item.priority} />
      </div>
    </div>
  );
}
