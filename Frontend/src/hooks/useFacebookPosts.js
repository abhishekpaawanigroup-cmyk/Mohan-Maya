import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFacebookPosts } from "../services/facebookApi";

const REFRESH_MS = 60_000;

export function useFacebookPosts(enabled) {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [configured, setConfigured] = useState(true);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setStatus((prev) => (prev === "loading" ? prev : "loading"));
    setError(null);

    try {
      const data = await fetchFacebookPosts({ limit: 24 }, ac.signal);
      if (ac.signal.aborted) return;
      setPosts(data.posts || []);
      setProfile(data.profile || null);
      setConfigured(data.configured ?? true);
      setStatus("ready");

      if (import.meta.env.DEV) {
        console.debug("[facebook] ui posts loaded", {
          count: data.posts?.length || 0,
          profile: data.profile || null,
          sample: data.posts?.[0] || null,
        });
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!enabled) {
      setStatus("idle");
      setPosts([]);
      setProfile(null);
      setConfigured(true);
      return;
    }

    load();
    const intervalId = window.setInterval(() => {
      load();
    }, REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
      abortRef.current?.abort();
    };
  }, [enabled, load]);

  const retry = useCallback(() => load(), [load]);

  return { posts, profile, status, error, configured, retry };
}
