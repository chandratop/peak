interface SectionHeaderProps {
  label: string;
  accent?: 'orange' | 'cyan';
  className?: string;
}

export default function SectionHeader({ label, accent = 'cyan', className = '' }: SectionHeaderProps) {
  const accentColor = accent === 'orange' ? 'bg-neon-orange' : 'bg-neon-cyan';
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      <div className={`w-1 h-3 ${accentColor} opacity-80`} />
      <span className="text-2xs tracking-[0.2em] uppercase text-neutral-400 font-mono">
        {label}
      </span>
    </div>
  );
}
