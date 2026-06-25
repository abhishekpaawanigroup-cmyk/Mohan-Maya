/**
 * Thin client for the backend's YouTube endpoints. The API key + channel id
 * live ONLY in the backend (Backend/.env); the frontend just calls these.
 *
 * Base URL comes from VITE_API_URL (see .env.example), defaulting to the local
 * backend port.
 */
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
// hi
/**
 * Fetch a page of the channel's latest uploads.
 * @returns {Promise<{ videos: Array, nextPageToken: string|null, total: number }>}
 */
export async function fetchYouTubeVideos({ pageToken = "", maxResults = 12 } = {}, signal) {
  const params = new URLSearchParams();
  if (pageToken) params.set("pageToken", pageToken);
  if (maxResults) params.set("maxResults", String(maxResults));

  const res = await fetch(`${API_URL}/api/youtube/videos?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`YouTube request failed (${res.status})`);

  const data = await res.json();
  return {
    videos: Array.isArray(data.videos) ? data.videos : [],
    nextPageToken: data.nextPageToken || null,
    total: data.total ?? 0,
  };
}

/**
 * Fetch public channel statistics (subscribers, total videos, total views).
 * Powers the Community page's live stat cards.
 * @returns {Promise<{ title: string, subscriberCount: number, videoCount: number, viewCount: number, url: string }>}
 */
export async function fetchYouTubeChannel(signal) {
  const res = await fetch(`${API_URL}/api/youtube/channel`, { signal });
  if (!res.ok) throw new Error(`Channel request failed (${res.status})`);
  return res.json();
}
