import ScrollReveal from "./ScrollReveal";

/**
 * Consistent decorative section heading used across the whole site:
 *
 *     ❖ ───── Heading Text ───── ❖
 *
 * Always centered, with responsive flanking lines and diamond ornaments tinted
 * with the section's accent colour (brand pink by default, gold for warm
 * sections). Optional eyebrow `badge` above and `subtitle` below.
 */
export default function SectionHeading({
  badge,
  title,
  subtitle,
  accent = "#fe4462",
  className = "",
}) {
  const line = "h-px flex-1 max-w-[36px] sm:max-w-[90px] lg:max-w-[120px]";

  return (
    <ScrollReveal className={`text-center max-w-3xl mx-auto ${className}`}>
      {badge && (
        <span
          className="inline-block bg-transparent border px-4 py-1 text-sm font-bold uppercase rounded-full tracking-wide mb-4"
          style={{ color: accent, borderColor: accent }}
        >
          {badge}
        </span>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <span className="shrink-0 text-base sm:text-lg leading-none" style={{ color: accent }} aria-hidden="true">
          ❖
        </span>
        <span
          className={line}
          style={{ backgroundImage: `linear-gradient(to right, transparent, ${accent})` }}
          aria-hidden="true"
        />
        <h2 className="font-bold text-2xl sm:text-4xl lg:text-5xl leading-tight" style={{ color: accent }}>
          {title}
        </h2>
        <span
          className={line}
          style={{ backgroundImage: `linear-gradient(to left, transparent, ${accent})` }}
          aria-hidden="true"
        />
        <span className="shrink-0 text-base sm:text-lg leading-none" style={{ color: accent }} aria-hidden="true">
          ❖
        </span>
      </div>

      {subtitle && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
