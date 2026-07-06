import axios from "axios";
import { env } from "../config/env.js";
import { cache } from "../utils/cache.js";

/**
 * Instagram Reels service.
 *
 * Fetches the configured account's latest reels through Apify's Instagram reel
 * scraper, normalises them into the shape the frontend expects, removes
 * duplicates, and sorts newest-first. Results are cached briefly so we don't
 * re-run the (relatively slow, metered) scrape on every visit.
 *
 * The token is read from the environment only (see config/env.js) and is sent
 * as a Bearer header — never placed in the URL — so it can't leak into logs.
 *
 * Auto-sync model: each cache refresh re-reads the live account, so newly
 * published reels appear and deleted ones drop off on the next refresh, with no
 * code changes.
 */

const TTL_REELS = 15 * 60 * 1000; // 15 min — fresh enough for a social feed
// Scraping can take a while; allow generously more than the YouTube client.
const ig = axios.create({ timeout: 90_000 });

/** Best-effort thumbnail from the various field names Apify actors emit. */
function pickThumbnail(item) {
  return (
    item.display_url ||
    item.displayUrl ||
    item.thumbnailUrl ||
    item.thumbnail_url ||
    item.thumbnailSrc ||
    item.thumbnail_src ||
    item.imageUrl ||
    item.image_url ||
    item.image ||
    ""
  );
}

/** Caption can be a plain string or an object depending on the actor version. */
function pickCaption(item) {
  if (typeof item.caption === "string") return item.caption;
  return item.caption?.text || item.text || "";
}

/** Classify an item as Reel / Carousel / Post from its type + productType. */
function pickMediaType(item) {
  const type = String(item.type || "").toLowerCase();
  const product = String(item.productType || "").toLowerCase();
  if (type === "sidecar" || type === "carousel") return "Carousel";
  if (product === "clips" || type === "video") return "Reel";
  return "Post";
}

/** Best-effort profile metadata from a raw reel item. */
function pickProfile(item, usernameFallback) {
  const user = item.user || item.from || item.author || item.owner || item.account || {};
  const profileName =
    user.name ||
    user.username ||
    user.handle ||
    item.username ||
    item.userName ||
    item.profileName ||
    usernameFallback ||
    "Mohan Maya";
  const profilePicture =
    user.profilePic ||
    user.profilePicture ||
    user.picture ||
    item.profilePic ||
    item.profilePicture ||
    item.thumbnail ||
    "";
  const profileUrl =
    user.profileUrl ||
    item.profileUrl ||
    item.url ||
    item.permalink ||
    item.link ||
    (usernameFallback ? `https://www.instagram.com/${usernameFallback.replace(/^@/, "")}/` : "");
  const followers =
    Number(user.followersCount ?? user.followers ?? item.followersCount ?? item.followerCount ?? item.followers ?? item.followers_count ?? 0) || null;
  const postCount = Number(user.postCount ?? user.posts ?? item.postCount ?? item.postsCount ?? 0) || null;

  return { profileName, profilePicture, profileUrl, followers, postCount };
}

/** Normalise one raw Apify item into the frontend card shape (or null). */
function normalizeReel(item) {
  const shortCode = item.shortCode || item.shortcode || item.code || item.id;
  const permalink =
    item.url ||
    item.postUrl ||
    (shortCode ? `https://www.instagram.com/p/${shortCode}/` : null);
  const publishedAt = item.timestamp || item.takenAt || item.taken_at || null;

  const display_url = item.display_url || item.displayUrl || null;
  const thumbnailUrl = item.thumbnailUrl || item.thumbnail_url || null;
  const thumbnailSrc = item.thumbnailSrc || item.thumbnail_src || null;
  const imageUrl = item.imageUrl || item.image_url || null;
  const image = item.image || null;

  // Best CDN URL available for this item (used to build the proxy URL).
  const bestCdnUrl =
    display_url ||
    thumbnailUrl ||
    thumbnailSrc ||
    imageUrl ||
    image ||
    (Array.isArray(item.images) && item.images[0]) ||
    null;

  // All Instagram CDN URLs return 403 when fetched directly by a browser
  // because they are session-bound signed URLs. We route them through the
  // backend /api/instagram/img proxy which fetches them server-to-server
  // with the correct headers, then streams the bytes back.
  const proxyUrl = bestCdnUrl
    ? `/api/instagram/img?url=${encodeURIComponent(bestCdnUrl)}`
    : null;

  const profileData = pickProfile(item, env.instagram.username);

  return {
    id: shortCode || permalink || null,
    caption: pickCaption(item).trim(),
    display_url,
    thumbnail: pickThumbnail(item),
    proxyUrl,
    thumbnailUrl,
    thumbnailSrc,
    imageUrl,
    image,
    permalink,
    publishedAt,
    mediaType: pickMediaType(item),
    views: Number(item.videoViewCount ?? item.viewCount ?? 0) || 0,
    likes: Number(item.likesCount ?? item.likeCount ?? 0) || 0,
    comments: Number(item.commentsCount ?? item.commentCount ?? 0) || 0,
    profileName: profileData.profileName,
    profilePicture: profileData.profilePicture,
    profileUrl: profileData.profileUrl,
    followers: profileData.followers,
    postCount: profileData.postCount,
  };
}

/** Raw Apify items from a pre-configured API URL (token embedded → just GET). */
async function fetchViaUrl(apiUrl) {
  const { data } = await ig.get(apiUrl);
  return Array.isArray(data) ? data : data?.items || [];
}

/** Raw Apify items by running the reel-scraper actor with a bare token. */
async function fetchViaActor({ apiToken, actorId, username, limit }) {
  const { data } = await ig.post(
    `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items`,
    { username: [username], resultsLimit: limit },
    { headers: { Authorization: `Bearer ${apiToken}` } }
  );
  return Array.isArray(data) ? data : data?.items || [];
}

/**
 * Fetch the latest reels for the configured account.
 * @returns {Promise<{ reels: Array, total: number, configured: boolean }>}
 */
export async function getLatestReels({ limit = 24 } = {}) {
  const { apiUrl, apiToken, username, actorId } = env.instagram;

  // Not configured → report gracefully so the UI shows an empty/soon state
  // instead of an error, and the rest of the site keeps working.
  if (!apiUrl && !apiToken) {
    return { reels: [], total: 0, configured: false };
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 60);
  const cacheKey = `ig:reels:${apiUrl ? "url" : username}:${safeLimit}`;

  return cache.wrap(cacheKey, TTL_REELS, async () => {
    const items = apiUrl
      ? await fetchViaUrl(apiUrl)
      : await fetchViaActor({ apiToken, actorId, username, limit: safeLimit });

    const seen = new Set();

    const reels = items
      .map(normalizeReel)
      // Keep only usable, non-duplicate entries.
      .filter((r) => r && r.id && r.permalink && r.thumbnail)
      .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
      // Newest first.
      .sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
      )
      .slice(0, safeLimit);

    const topReel = reels[0] || null;
    const profile = topReel
      ? {
          name: topReel.profileName,
          profilePicture: topReel.profilePicture,
          profileUrl: topReel.profileUrl,
          followers: topReel.followers,
          postCount: topReel.postCount || reels.length,
        }
      : null;

    return { reels, total: reels.length, configured: true, profile };
  });
}
