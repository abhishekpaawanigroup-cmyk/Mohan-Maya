/**
 * Thin client for the backend's Instagram endpoint. The API token lives ONLY in
 * the backend (Backend/.env); the frontend just calls this. Mirrors the shape
 * and conventions of youtubeApi.js.
 *
 * Base URL comes from VITE_API_URL, defaulting to the local backend port.
 */
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Fetch the latest reels for the configured account (already deduped and sorted
 * newest-first by the backend).
 * @returns {Promise<{ reels: Array, total: number, configured: boolean }>}
 */
export async function fetchInstagramReels({ limit = 24 } = {}, signal) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`${API_URL}/api/instagram/reels?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Instagram request failed (${res.status})`);

  const data = await res.json();
  return {
    reels: Array.isArray(data.reels) ? data.reels : [],
    profile: data.profile || null,
    total: data.total ?? 0,
    configured: data.configured !== false,
  };
}
