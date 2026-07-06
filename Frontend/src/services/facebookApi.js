const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function fetchFacebookPosts({ limit = 24 } = {}, signal) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`${API_URL}/api/facebook/posts?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Facebook request failed (${res.status})`);

  const data = await res.json();
  return {
    posts: Array.isArray(data.posts) ? data.posts : [],
    profile: data.profile || null,
    total: data.total ?? 0,
    configured: data.configured ?? false,
  };
}
