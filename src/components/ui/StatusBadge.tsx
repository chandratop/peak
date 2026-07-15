import type { GearStatus, GearPriority } from '@/types/gear';

interface StatusBadgeProps {
  status: GearStatus;
  priority: GearPriority;
}

export default function StatusBadge({ status, priority }: StatusBadgeProps) {
  const isPacked = status === 'packed';
  const isCritical = priority === 'critical';

  return (
    <span
      className={`inline-flex items-center gap-1 text-2xs font-mono tracking-widest px-1.5 py-0.5 border ${
        isCritical && !isPacked
          ? 'border-neon-orange/50 text-neon-orange'
          : 'border-neutral-800 text-neutral-500'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPacked ? 'bg-neon-cyan' : 'bg-neon-orange'}`} />
      {status.toUpperCase()}
    </span>
  );
}
