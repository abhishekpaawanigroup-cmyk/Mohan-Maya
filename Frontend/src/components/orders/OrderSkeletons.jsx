/** Skeleton placeholders shown while orders "load" (brief, for a polished feel). */

export function OrderCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03] sm:px-5">
        <div className="space-y-1.5">
          <div className="skeleton h-2.5 w-14 rounded" />
          <div className="skeleton h-3.5 w-24 rounded" />
        </div>
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="skeleton h-[76px] w-[76px] rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="skeleton h-2.5 w-16 rounded" />
              <div className="skeleton h-3.5 w-20 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="skeleton h-10 flex-1 rounded-full" />
          <div className="skeleton h-10 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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
