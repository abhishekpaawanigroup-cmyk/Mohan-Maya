import { useCallback, useEffect, useRef, useState } from "react";
import { fetchYouTubeVideos } from "../services/youtubeApi";

const PAGE = 50; // YouTube's max page size -fewest requests to load everything
const MAX_PAGES = 20; // safety cap (1000 videos) against a runaway pagination loop

/**
 * Loads the channel's ENTIRE upload history from the backend, walking
 * `nextPageToken` until the channel is exhausted, then exposes the full deduped
 * list. Display pagination is handled client-side by the consumer, so the page
 * count always reflects the real number of videos.
 *
 * status: "loading" | "ready" | "error"
 */
export function useYouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const loadAll = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setStatus("loading");
    setError(null);

    try {
      const all = [];
      const seen = new Set(); // dedupe by videoId across pages
      let token = "";

      for (let i = 0; i < MAX_PAGES; i++) {
        const data = await fetchYouTubeVideos(
          { pageToken: token, maxResults: PAGE },
          ac.signal
        );
        if (ac.signal.aborted) return;

        for (const v of data.videos) {
          if (v.videoId && !seen.has(v.videoId)) {
            seen.add(v.videoId);
            all.push(v);
          }
        }

        token = data.nextPageToken;
        if (!token) break;
      }

      if (ac.signal.aborted) return;
      setVideos(all);
      setTotal(all.length);
      setStatus("ready");
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Deferred so the initial fetch isn't a synchronous setState in the effect.
    const t = setTimeout(loadAll, 0);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
    };
  }, [loadAll]);

  const retry = useCallback(() => loadAll(), [loadAll]);

  return { videos, total, status, error, retry };
}
