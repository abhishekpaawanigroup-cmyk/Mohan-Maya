/** Loading placeholder that matches VideoCard's shape (no layout shift). */
export default function VideoSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-white/80 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
      <div className="aspect-video skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/4 skeleton rounded-full" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="h-11 w-full skeleton rounded-full mt-2" />
      </div>
    </div>
  );
}
