import type { GearStatus, GearPriority } from '@/types/gear';

interface StatusBadgeProps {
  status: GearStatus;
  priority: GearPriority;
}

export default function StatusBadge({ status, priority }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 text-2xs font-mono tracking-widest px-1.5 py-0.5 border ${
          priority === 'critical'
            ? 'border-neon-orange/40 text-neon-orange'
            : 'border-neutral-800 text-neutral-500'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'packed' ? 'bg-neon-cyan' : 'bg-neon-orange'
          }`}
        />
        {status.toUpperCase()}
      </span>
    </div>
  );
}
