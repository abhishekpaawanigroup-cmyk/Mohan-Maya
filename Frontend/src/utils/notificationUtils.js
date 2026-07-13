/**
 * Format timestamp relative to now (e.g., "Just now", "2 hours ago", "Yesterday")
 */
export const formatNotificationTime = (isoTimestamp) => {
  try {
    const now = new Date();
    const timestamp = new Date(isoTimestamp);
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    // Just now
    if (diffInSeconds < 60) return "Just now";

    // Minutes ago
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    // Hours ago
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      timestamp.toDateString() === yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    // Days ago (last 7 days)
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    // Formatted date
    return timestamp.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: timestamp.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch (err) {
    console.error("Error formatting notification time:", err);
    return "Recently";
  }
};

/**
 * Get the date group label for a notification (Today, Yesterday, Earlier)
 */
export const getNotificationDateGroup = (isoTimestamp) => {
  try {
    const now = new Date();
    const timestamp = new Date(isoTimestamp);

    // Today
    if (timestamp.toDateString() === now.toDateString()) {
      return "Today";
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (timestamp.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Earlier
    return "Earlier";
  } catch (err) {
    console.error("Error getting notification date group:", err);
    return "Earlier";
  }
};

/**
 * Group notifications by date (Today, Yesterday, Earlier)
 */
export const groupNotificationsByDate = (notifications) => {
  const grouped = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  notifications.forEach((notif) => {
    const group = getNotificationDateGroup(notif.timestamp);
    if (grouped[group]) {
      grouped[group].push(notif);
    }
  });

  return grouped;
};

/**
 * Get icon color based on notification category
 */
export const getNotificationIconColor = (category) => {
  const colorMap = {
    account: "text-[#fe4462]",
    order: "text-blue-500",
    shopping: "text-purple-500",
    promotion: "text-amber-500",
    review: "text-orange-500",
  };
  return colorMap[category] || "text-[#fe4462]";
};

/**
 * Get background color for category based notification background
 */
export const getNotificationBgColor = (category) => {
  const bgMap = {
    account: "bg-[#fe4462]/10",
    order: "bg-blue-500/10",
    shopping: "bg-purple-500/10",
    promotion: "bg-amber-500/10",
    review: "bg-orange-500/10",
  };
  return bgMap[category] || "bg-[#fe4462]/10";
};
