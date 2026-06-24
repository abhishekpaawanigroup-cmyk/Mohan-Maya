import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import VideoCard from "./VideoCard";
import VideoSkeleton from "./VideoSkeleton";

const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

/** Renders the YouTube videos grid with loading / error / empty / load-more. */
export default function YouTubeTab({ videos, status, error, hasMore, loadMore, retry }) {
  // First load — skeletons.
  if (status === "loading" && videos.length === 0) {
    return (
      <div className={GRID}>
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Hard error with nothing to show — retry.
  if (status === "error" && videos.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-[#fe4462]/10 text-[#fe4462] mb-4">
          <FiAlertCircle size={26} />
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Couldn't load videos</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
          {error?.message || "Something went wrong while reaching the server."}
        </p>
        <button
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 bg-[#fe4462] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d93550] transition-colors"
        >
          <FiRefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  // Loaded but empty.
  if (status === "ready" && videos.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-[#fe4462]/10 text-[#fe4462] mb-4">
          <FiInbox size={26} />
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No videos yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">New uploads will appear here automatically.</p>
      </div>
    );
  }

  return (
    <>
      <div className={GRID}>
        {videos.map((v, i) => (
          <ScrollReveal key={v.videoId} direction="up" delay={Math.min((i % 6) * 0.05, 0.25)}>
            <VideoCard video={v} />
          </ScrollReveal>
        ))}
      </div>

      {/* Inline note if a Load More request failed but we still have videos. */}
      {status === "error" && videos.length > 0 && (
        <p className="text-center text-sm text-[#fe4462] mt-6">
          Couldn't load more right now. Please try again.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            disabled={status === "loadingMore"}
            className="inline-flex items-center gap-2 bg-[#fe4462] text-white font-semibold px-8 py-3.5 rounded-full shadow-sm hover:bg-[#d93550] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loadingMore" ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Loading…
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </>
  );
}
