import { Skeleton, CardSkeleton } from './Skeleton';

export function LocationPanelSkeleton() {
  return (
    <div className="card h-full p-4 space-y-6">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4 mt-2" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 h-80"><Skeleton className="h-full w-full" /></div>
        <div className="card p-5 h-80"><Skeleton className="h-full w-full" /></div>
      </div>
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-20" />
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="border rounded-2xl p-4">
          <Skeleton className="h-6 w-1/2 mb-3" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-8" />)}
          </div>
        </div>
      ))}
    </div>
  );
}
