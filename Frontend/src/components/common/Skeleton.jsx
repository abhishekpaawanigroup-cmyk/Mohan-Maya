/** Skeleton placeholder for a product card while data "loads". */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-md">
      <div className="skeleton h-[230px] w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 mx-auto rounded" />
        <div className="skeleton h-4 w-1/2 mx-auto rounded" />
        <div className="skeleton h-10 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
