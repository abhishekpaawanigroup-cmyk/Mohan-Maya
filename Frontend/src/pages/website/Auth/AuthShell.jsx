import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Centered card layout shared by the secondary auth flows (forgot / reset /
 * verify). Matches the main Auth page background and brand styling.
 */
export default function AuthShell({ title, subtitle, children, footer, backTo = "/auth", backLabel = "Back to sign in" }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff5f7] via-[#fbfefb] to-[#fdf3e7] px-4 pt-24 pb-12 dark:from-[#1a0a0e] dark:via-[#0d0508] dark:to-[#160c11]">
      <div className="pointer-events-none absolute -top-28 -right-24 h-96 w-96 rounded-full bg-[#fe4462]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-[#c48212]/15 blur-3xl" />

      <Link
        to={backTo}
        className="absolute top-24 left-4 z-50 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#fe4462] dark:text-gray-400 sm:left-8"
      >
        <FiArrowLeft /> {backLabel}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-black/5 dark:bg-[#140a0d] dark:ring-white/10 sm:p-9"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fe4462] to-[#c48212]" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{footer}</div>}
      </motion.div>
    </section>
  );
}
