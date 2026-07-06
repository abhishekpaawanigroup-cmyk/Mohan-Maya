import { env } from "../config/env.js";

const DATASET_URL = env.facebook?.apiUrl || "";

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

  const user = item.user || {};
  const media = Array.isArray(item.media) ? item.media : [];
  const primaryMedia = media[0] || {};
  const thumbnail =
    primaryMedia.thumbnail ||
    primaryMedia.thumbnailImage?.uri ||
    item.thumbnail ||
    item.coverImage ||
    item.image ||
    user.profilePic ||
    "";

  const caption = item.text || item.caption || item.description || "";
  const publishedAt = normalizeDate(item.time || item.timestamp || item.publishedAt);
  const type = item.isVideo || item.isVideoPost || primaryMedia.__typename === "Video" ? "Reel" : "Post";

  return {
    id: item.postId || item.id || item.url || `${type}-${publishedAt}`,
    postId: item.postId || item.id || "",
    url: item.url || item.postUrl || item.facebookUrl || "",
    permalink: item.url || item.postUrl || item.facebookUrl || "",
    caption,
    publishedAt,
    type,
    likes: Number(item.likes ?? item.topReactionsCount ?? item.reactionCount ?? 0),
    comments: Number(item.comments ?? item.commentCount ?? item.comment_count ?? 0),
    shares: Number(item.shares ?? item.shareCount ?? item.share_count ?? 0),
    views: Number(item.viewsCount ?? item.videoPostViewCount ?? item.viewCount ?? 0),
    thumbnail,
    profilePicture: user.profilePic || item.profilePicture || "",
    profileName: user.name || item.pageName || item.page?.name || "Mohan Maya",
    profileUrl: user.profileUrl || item.facebookUrl || item.url || "",
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
