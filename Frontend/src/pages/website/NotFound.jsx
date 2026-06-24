import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { usePageMeta } from "../../hooks/useHooks";

export default function NotFound() {
  usePageMeta("Page Not Found - Mohan Maya", "The page you're looking for doesn't exist or has been moved.");
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f0e0e3] dark:bg-[#0d0508] px-5 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-[120px] sm:text-[160px] font-black leading-none text-gradient">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <FiHome size={18} /> Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
