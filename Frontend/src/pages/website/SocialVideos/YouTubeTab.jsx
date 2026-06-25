import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import VideoCard from "./VideoCard";
import VideoSkeleton from "./VideoSkeleton";
import FeaturedVideo from "./FeaturedVideo";
import Pagination from "./Pagination";

// auto-rows-fr keeps every row the same height → perfectly uniform cards.
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 auto-rows-fr";
const PER_PAGE = 6; // videos shown per page beneath the featured one

/** Renders the YouTube tab: featured latest video + paginated grid of the rest. */
export default function YouTubeTab({ videos, status, error, hasMore, loadMore, retry }) {
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);
  // Set when "Next" on the last page kicks off a fetch; advances once it lands.
  const pendingNextRef = useRef(false);
  const prevStatusRef = useRef(status);

  const scrollToGrid = () => {
    const el = gridRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // After a "load more" triggered by Next resolves, advance to the new page.
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;
    if (prev === "loadingMore" && status === "ready" && pendingNextRef.current) {
      pendingNextRef.current = false;
      setPage((p) => p + 1);
      scrollToGrid();
    }
  }, [status]);

  // ── First load — skeletons (featured + grid). ──
  if (status === "loading" && videos.length === 0) {
    return (
      <div className="space-y-10">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl">
          <div className="aspect-video lg:aspect-auto lg:min-h-[340px] skeleton" />
          <div className="p-7 sm:p-9 lg:p-11 space-y-4">
            <div className="h-6 w-40 skeleton rounded-full" />
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-8 w-1/2 skeleton rounded" />
            <div className="h-5 w-32 skeleton rounded" />
            <div className="h-12 w-44 skeleton rounded-full mt-2" />
          </div>
        </div>
        <div className={GRID}>
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Hard error with nothing to show — retry. ──
  if (status === "error" && videos.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-14 px-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-[#fe4462]/10 text-[#fe4462] mb-5">
          <FiAlertCircle size={28} />
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Couldn't load videos</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
          {error?.message || "Something went wrong while reaching the server."}
        </p>
        <button
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#fe4462] to-[#d93550] text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-[#fe4462]/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <FiRefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  // ── Loaded but empty. ──
  if (status === "ready" && videos.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-14 px-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.25)]">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-[#fe4462]/10 text-[#fe4462] mb-5">
          <FiInbox size={28} />
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No videos yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">New uploads will appear here automatically.</p>
      </div>
    );
  }

  // ── Loaded content: featured + paginated grid. ──
  const [featured, ...rest] = videos;
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageVideos = rest.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    scrollToGrid();
  };
  const goPrev = () => {
    if (safePage > 1) goTo(safePage - 1);
  };
  const goNext = () => {
    if (safePage < totalPages) goTo(safePage + 1);
    else if (hasMore && status !== "loadingMore") {
      pendingNextRef.current = true;
      loadMore();
    }
  };

  return (
    <div className="space-y-12">
      {featured && <FeaturedVideo video={featured} />}

      {rest.length > 0 && (
        <div>
          {/* Section sub-header */}
          <div className="flex items-center justify-between gap-4 mb-7">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              More Videos
            </h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Page {safePage} of {totalPages}
            </span>
          </div>

          <div ref={gridRef} className="scroll-mt-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={GRID}
              >
                {pageVideos.map((v, i) => (
                  <ScrollReveal key={v.videoId} direction="up" delay={Math.min(i * 0.05, 0.25)} className="h-full">
                    <VideoCard video={v} />
                  </ScrollReveal>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Inline note if a Load More request failed but we still have videos. */}
          {status === "error" && (
            <p className="text-center text-sm text-[#fe4462] mt-6">
              Couldn't load more right now. Please try again.
            </p>
          )}

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={goTo}
            onPrev={goPrev}
            onNext={goNext}
            nextLoading={status === "loadingMore"}
            nextHasMore={hasMore}
          />
        </div>
      )}
    </div>
  );
}
