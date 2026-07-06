import { env } from "../config/env.js";

const DATASET_URL = env.facebook?.apiUrl || "";

function getFirstValue(source, keys) {
  if (!source || typeof source !== "object") return "";
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) return trimmed;
      } else {
        return value;
      }
    }
  }
  return "";
}

function normalizeDate(value) {
  if (!value) return "";
  if (typeof value === "number") {
    const date = new Date(value < 1e12 ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric) && String(value).trim().length < 13) {
    const date = new Date(numeric * 1000);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function normalizePost(item) {
  if (!item || typeof item !== "object") return null;

  const user = item.user || item.from || item.author || {};
  const media = Array.isArray(item.media) ? item.media : [];
  const primaryMedia = media[0] || {};
  const thumbnail =
    primaryMedia.thumbnail ||
    primaryMedia.thumbnailImage?.uri ||
    item.full_picture ||
    item.picture ||
    item.thumbnail ||
    item.coverImage ||
    item.image ||
    item.attachments?.[0]?.media?.image?.src ||
    user.profilePic ||
    "";

  const caption = getFirstValue(item, ["text", "message", "caption", "description", "story", "content"]);
  const publishedAt = normalizeDate(getFirstValue(item, ["time", "timestamp", "created_time", "createdAt", "publishedAt"]));
  const type = item.isVideo || item.isVideoPost || primaryMedia.__typename === "Video" || getFirstValue(item, ["type", "postType"]) === "video" ? "Reel" : "Post";

  return {
    id: item.postId || item.id || item.url || `${type}-${publishedAt}`,
    postId: item.postId || item.id || "",
    url: item.url || item.postUrl || item.facebookUrl || item.permalink || item.link || "",
    permalink: item.url || item.postUrl || item.facebookUrl || item.permalink || item.link || "",
    caption,
    publishedAt,
    type,
    likes: Number(item.likes ?? item.reactions?.summary?.total_count ?? item.topReactionsCount ?? item.reactionCount ?? 0),
    comments: Number(item.comments ?? item.commentCount ?? item.comment_count ?? item.comments_count ?? 0),
    shares: Number(item.shares ?? item.shareCount ?? item.share_count ?? item.shares_count ?? 0),
    views: Number(item.viewsCount ?? item.videoPostViewCount ?? item.viewCount ?? item.views ?? 0),
    thumbnail,
    profilePicture: user.profilePic || item.profilePicture || "",
    profileName: user.name || item.pageName || item.page?.name || "Mohan Maya",
    profileUrl: user.profileUrl || item.facebookUrl || item.url || item.permalink || item.link || "",
    coverImage: item.coverImage || item.user?.coverImage || item.page?.coverImage || "",
    followers: Number(item.followersCount ?? item.followerCount ?? item.followers ?? 0) || null,
    pageName: item.pageName || user.name || "Mohan Maya",
  };
}

export async function getFacebookPosts({ limit = 24 } = {}) {
  if (!DATASET_URL) {
    return { posts: [], configured: false, total: 0, profile: null };
  }

  const response = await fetch(DATASET_URL, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Facebook dataset request failed (${response.status})`);
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];

  if (env.nodeEnv !== "production") {
    console.debug("[facebook] dataset response", {
      received: Array.isArray(data) ? data.length : Array.isArray(data?.items) ? data.items.length : 0,
      shape: Array.isArray(data) ? "array" : data && typeof data === "object" ? Object.keys(data).slice(0, 8) : typeof data,
      sample: items[0] || null,
    });
  }

  const normalized = items
    .map(normalizePost)
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));

  const topPost = normalized[0] || null;
  const profile = topPost
    ? {
        name: topPost.profileName,
        profilePicture: topPost.profilePicture,
        profileUrl: topPost.profileUrl,
        coverImage: topPost.coverImage,
        followers: topPost.followers,
        postCount: normalized.length,
      }
    : null;

  return {
    posts: normalized.slice(0, limit),
    profile,
    configured: true,
    total: normalized.length,
  };
}
