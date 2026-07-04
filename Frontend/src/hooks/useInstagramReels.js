import { useCallback, useEffect, useRef, useState } from "react";
import { fetchInstagramReels } from "../services/instagramApi";

/**
 * Loads the account's latest reels from the backend. The list is already
 * deduped and sorted newest-first server-side, so this hook just owns the
 * request lifecycle (abortable, retryable).
 *
 * LAZY: it only fires the first time `enabled` becomes true — so opening the
 * Community page (YouTube tab) never triggers the metered Instagram scrape; it
 * runs only when the user actually opens the Instagram tab, and the result then
 * persists while switching tabs.
 *
 * status: "idle" | "loading" | "ready" | "error"
 */
export function useInstagramReels(enabled) {
  const [reels, setReels] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [configured, setConfigured] = useState(true);
  const abortRef = useRef(null);
  const startedRef = useRef(false);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setStatus("loading");
    setError(null);

    try {
      const data = await fetchInstagramReels({ limit: 24 }, ac.signal);
      if (ac.signal.aborted) return;
      setReels(data.reels);
      setConfigured(data.configured);
      setStatus("ready");
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (enabled && !startedRef.current) {
      startedRef.current = true;
      // Deferred so the fetch isn't a synchronous setState inside the effect.
      const t = setTimeout(load, 0);
      return () => clearTimeout(t);
    }
  }, [enabled, load]);

  // Abort any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const retry = useCallback(() => load(), [load]);

  return { reels, status, error, configured, retry };
}
