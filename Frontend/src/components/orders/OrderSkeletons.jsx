/** Skeleton placeholders shown while orders "load" (brief, for a polished feel). */

export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-5">
      <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 pb-3">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-4 w-28 rounded" />
        </div>
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 border-t border-gray-100 dark:border-white/10 pt-4">
        <div className="skeleton h-10 flex-1 rounded-full" />
        <div className="skeleton h-10 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export function OrderCardSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderRowSkeleton({ cols = 8 }) {
  return (
    <tr className="border-b border-gray-100 dark:border-white/10">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}
