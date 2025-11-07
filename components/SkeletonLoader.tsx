'use client';

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl shadow-sm bg-card text-card-foreground border border-border"
        >
          <div className="h-48 w-full animate-pulse bg-muted" />
          <div className="p-5">
            <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mb-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

