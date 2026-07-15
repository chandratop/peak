'use client';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export default function LoadingSkeleton({ className = '', rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-neutral-900 rounded-sm animate-pulse"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  );
}
