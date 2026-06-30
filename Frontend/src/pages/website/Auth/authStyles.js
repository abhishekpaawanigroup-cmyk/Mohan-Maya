// Shared input + button styling for the auth flow pages (forgot / reset / verify),
// kept consistent with the main Auth page.
export const fieldCls = (invalid) =>
  `w-full bg-gray-50 dark:bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-[#fe4462]/15 focus:border-[#fe4462] focus:bg-white dark:focus:bg-white/[0.07] focus-visible:!outline-none ${
    invalid ? "border-red-400 focus:ring-red-400/15" : "border-gray-200 dark:border-white/10"
  }`;

export const btnPrimary =
  "w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fe4462] to-[#d93550] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_12px_28px_-10px_rgba(254,68,98,0.7)] transition-shadow duration-200 hover:shadow-[0_16px_34px_-10px_rgba(254,68,98,0.85)] disabled:cursor-not-allowed disabled:opacity-70";
