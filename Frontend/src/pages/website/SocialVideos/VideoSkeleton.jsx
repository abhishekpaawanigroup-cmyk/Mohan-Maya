/** Loading placeholder that matches VideoCard's shape (no layout shift). */
export default function VideoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/3 skeleton rounded" />
        <div className="h-9 w-full skeleton rounded-full mt-2" />
      </div>
    </div>
  );
}
