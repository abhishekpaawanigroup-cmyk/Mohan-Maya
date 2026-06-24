import { useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for an autoplaying background <video>.
 * - Defers the download until the video is ~200px from entering the viewport
 *   (so a below-the-fold video never blocks initial load).
 * - Plays only while visible and PAUSES when scrolled off-screen, which stops
 *   continuous offscreen video decoding - a common cause of scroll FPS drops.
 * Appearance is identical to a normal autoplay/muted/loop video when in view.
 */
export default function LazyVideo({ src, type = "video/mp4", className = "", poster, ...rest }) {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once the <source> is attached, load it and start playback.
  useEffect(() => {
    const el = ref.current;
    if (load && el) {
      el.load();
      el.play?.().catch(() => {});
    }
  }, [load]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={className}
      {...rest}
    >
      {load && <source src={src} type={type} />}
    </video>
  );
}
