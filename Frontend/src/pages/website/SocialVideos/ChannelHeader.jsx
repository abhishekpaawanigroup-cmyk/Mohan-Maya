import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { formatCompact } from "../../../utils/format";

/**
 * Build the canonical "subscribe" deep-link for the channel. Appending
 * `?sub_confirmation=1` makes YouTube pop the subscribe confirmation dialog
 * immediately. Falls back to a search link if the channel URL isn't loaded yet.
 */
function subscribeUrl(channel, fallback) {
  if (channel?.url) return `${channel.url}?sub_confirmation=1`;
  return fallback;
}

/** The red, YouTube-style Subscribe CTA -hover scale + shadow, click press. */
function SubscribeButton({ href, compact = false }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`group inline-flex items-center gap-2 rounded-full bg-[#ff0000] font-semibold text-white shadow-lg shadow-red-500/30 hover:bg-[#cc0000] duration-200 ${
        compact ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm sm:text-base"
      }`}
    >
      <FaYoutube size={compact ? 18 : 22} className="transition-transform duration-300 group-hover:scale-110" />
      Subscribe
    </motion.a>
  );
}

/** Channel avatar with a graceful fallback to the YouTube glyph. */
function Avatar({ src, alt, size }) {
  const [ok, setOk] = useState(true);
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#ff0000] text-white ring-2 ring-white/80 dark:ring-white/10 shadow-lg"
      style={{ height: size, width: size }}
    >
      {src && ok ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <FaYoutube size={size * 0.5} />
      )}
    </span>
  );
}

/**
 * YouTube-style channel header for the Community video section.
 *
 * - Channel avatar, name + verified badge, subscriber / video metadata.
 * - Prominent red Subscribe CTA on the right with smooth hover + click motion.
 * - A sticky compact bar slides in once the main header scrolls out of view, so
 *   the Subscribe CTA stays visible while browsing the videos below.
 */
export default function ChannelHeader({ channel, status, verified = true, fallbackUrl }) {
  const isLoading = status === "loading";
  const href = subscribeUrl(channel, fallbackUrl);
  const name = channel?.title || "Mohan Maya";

  // Watch the main header; reveal the sticky bar only while it's off-screen.
  const sentinelRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      // Account for the fixed navbar (h-20) so the bar appears as the header
      // tucks under it rather than the moment it touches the viewport edge.
      { rootMargin: "-96px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Main channel header card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl p-5 sm:p-7 shadow-[0_14px_50px_-22px_rgba(0,0,0,0.3)]"
      >
        {/* Brand wash */}
        <span className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[#ff0000]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Identity */}
          <div className="flex items-center gap-4 sm:gap-5">
            {isLoading ? (
              <span className="h-16 w-16 sm:h-20 sm:w-20 rounded-full skeleton shrink-0" />
            ) : (
              <Avatar src={channel?.thumbnail} alt={`${name} channel avatar`} size={72} />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h3>
                {verified && (
                  <MdVerified
                    size={20}
                    className="shrink-0 text-[#ff0000]"
                    title="Verified channel"
                    aria-label="Verified channel"
                  />
                )}
              </div>

              {isLoading ? (
                <div className="mt-2 h-4 w-40 rounded skeleton" />
              ) : (
                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {formatCompact(channel?.subscriberCount ?? 0)}
                  </span>{" "}
                  subscribers
                  {channel?.videoCount ? (
                    <>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {formatCompact(channel.videoCount)}
                      </span>{" "}
                      videos
                    </>
                  ) : null}
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <SubscribeButton href={href} />
          </div>
        </div>
      </motion.div>

      {/* Sentinel marks where the header sits; sticky bar shows once it leaves. */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {/* ── Sticky compact bar (always-visible Subscribe while scrolling) ── */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-0 top-20 z-40"
          >
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
