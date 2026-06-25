import { useEffect, useRef, useState } from "react";
import { fetchYouTubeChannel } from "../services/youtubeApi";

/**
 * Loads public YouTube channel statistics (subscribers, video count, total
 * views) once on mount for the Community page's live stat cards.
 *
 * status: "loading" | "ready" | "error"
 */
export function useYouTubeChannel() {
  const [channel, setChannel] = useState(null);
  const [status, setStatus] = useState("loading");
  const abortRef = useRef(null);

  useEffect(() => {
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const data = await fetchYouTubeChannel(ac.signal);
        if (ac.signal.aborted) return;
        setChannel(data);
        setStatus("ready");
      } catch (e) {
        if (e?.name === "AbortError") return;
        setStatus("error");
      }
    })();

    return () => ac.abort();
  }, []);

  return { channel, status };
}
