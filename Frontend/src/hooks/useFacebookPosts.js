import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFacebookPosts } from "../services/facebookApi";

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
    setStatus("loading");
    setError(null);

    try {
      const data = await fetchFacebookPosts({ limit: 24 }, ac.signal);
      if (ac.signal.aborted) return;
      setPosts(data.posts || []);
      setProfile(data.profile || null);
      setConfigured(data.configured ?? true);
      setStatus("ready");
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      setPosts([]);
      setProfile(null);
      setConfigured(true);
      return;
    }

    const t = setTimeout(load, 0);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
    };
  }, [enabled, load]);

  const retry = useCallback(() => load(), [load]);

  return { posts, profile, status, error, configured, retry };
}
