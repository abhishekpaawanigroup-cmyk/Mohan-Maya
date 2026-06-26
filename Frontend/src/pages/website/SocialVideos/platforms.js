import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";

// Official channels (kept in sync with the footer).
const LINKS = {
  youtube: "https://www.youtube.com/results?search_query=mohanmaya",
  instagram: "https://instagram.com/mohanmaya_",
  facebook: "https://www.facebook.com/share/18dgmfQ39U/",
};

/**
 * SINGLE source of truth for the Community page. Everything platform-specific —
 * data, icons, links and the visual theme — is driven from here, so adding a
 * new platform is just another entry in this array.
 *
 * Theme fields feed CSS custom properties on the page wrapper (see `themeVars`),
 * which the whole Community UI reads (`var(--accent)` etc.). Switching tabs just
 * swaps these values, and elements transition their colours smoothly.
 *
 *  - accent / accent2 : primary colour + gradient end
 *  - color            : alias of accent (consumed by per-platform cards)
 *  - soft / glow / ring: pre-baked rgba tints (avoids Tailwind opacity-on-var quirks)
 *  - tagline          : platform-flavoured hero subheading
 */
export const PLATFORMS = [
  {
    key: "youtube",
    label: "YouTube",
    name: "YouTube",
    Icon: FaYoutube,
    href: LINKS.youtube,
    handle: "Mohan Maya",
    tagline: "Tutorials, showcases and behind-the-scenes films from our studio.",
    accent: "#fd0000",
    accent2: "#cc0000",
    color: "#ff0000",
    soft: "rgba(255,0,0,0.10)",
    glow: "rgba(255,0,0,0.16)",
    ring: "rgba(255,0,0,0.38)",
  },
  {
    key: "instagram",
    label: "Instagram",
    name: "Instagram",
    Icon: FaInstagram,
    href: LINKS.instagram,
    handle: "@mohanmaya_",
    tagline: "Reels, carousels and daily moments from our handcrafted world.",
    accent: "#e1306c",
    accent2: "#f77737",
    color: "#e1306c",
    soft: "rgba(225,48,108,0.10)",
    glow: "rgba(225,48,108,0.18)",
    ring: "rgba(225,48,108,0.40)",
  },
  {
    key: "facebook",
    label: "Facebook",
    name: "Facebook",
    Icon: FaFacebookF,
    href: LINKS.facebook,
    handle: "Mohan Maya",
    tagline: "Community updates, stories and conversations with our followers.",
    accent: "#1877f2",
    accent2: "#0a5dc2",
    color: "#1877f2",
    soft: "rgba(24,119,242,0.10)",
    glow: "rgba(24,119,242,0.16)",
    ring: "rgba(24,119,242,0.40)",
  },
];

export const platformMap = Object.fromEntries(PLATFORMS.map((p) => [p.key, p]));

/** CSS custom properties the Community page reads for its accent theme. */
export const themeVars = (p) => ({
  "--accent": p.accent,
  "--accent2": p.accent2,
  "--soft": p.soft,
  "--glow": p.glow,
  "--ring": p.ring,
});
