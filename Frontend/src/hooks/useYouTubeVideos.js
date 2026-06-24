import { useCallback, useEffect, useRef, useState } from "react";
import { fetchYouTubeVideos } from "../services/youtubeApi";

/**
 * Loads the channel's latest YouTube uploads from the backend with "Load More"
 * pagination.
 *
 * - Fetches the first page once on mount (no polling — fresh content arrives via
 *   the backend's short cache whenever the page is revisited/reloaded).
 * - `loadMore` appends the next page using the API's nextPageToken.
 * - Exposes clean status/error so the UI can show skeletons, errors and a
 *   Load More button.
 *
 * status: "loading" | "loadingMore" | "ready" | "error"
 */
export function useYouTubeVideos(pageSize = 12) {
  const [videos, setVideos] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchPage = useCallback(
    async (token) => {
      const isFirst = !token;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setStatus(isFirst ? "loading" : "loadingMore");
      setError(null);
      try {
        const data = await fetchYouTubeVideos(
          { pageToken: token, maxResults: pageSize },
          ac.signal
        );
        if (ac.signal.aborted) return;
        setVideos((prev) => (isFirst ? data.videos : [...prev, ...data.videos]));
        setNextToken(data.nextPageToken);
        setStatus("ready");
      } catch (e) {
        if (e?.name === "AbortError") return;
        setError(e);
        setStatus("error");
      }
    },
    [pageSize]
  );

  useEffect(() => {
    // Deferred so the initial fetch isn't a synchronous setState in the effect.
    const t = setTimeout(() => fetchPage(""), 0);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (nextToken && status !== "loadingMore") fetchPage(nextToken);
  }, [nextToken, status, fetchPage]);

  const retry = useCallback(() => fetchPage(""), [fetchPage]);

  return {
    videos,
    status,
    error,
    hasMore: Boolean(nextToken),
    loadMore,
    retry,
  };
}
