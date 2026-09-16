import type { GearStatus } from '@/types/gear';

interface StatusBadgeProps {
  status: GearStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPacked = status === 'packed';

  return (
    <span className="inline-flex items-center gap-1 text-2xs font-mono tracking-widest px-1.5 py-0.5 border border-neutral-800 text-neutral-500">
      <span className={`w-1.5 h-1.5 rounded-full ${isPacked ? 'bg-neon-cyan' : 'bg-neon-orange'}`} />
      {status.toUpperCase()}
    </span>
  );
}
