import { Suspense } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/website/Header";
import Footer from "../components/website/Footer";
import ScrollProgress from "../components/common/ScrollProgress";
import BackToTop from "../components/common/BackToTop";
import ScrollToTop from "../components/common/ScrollToTop";
import ToastContainer from "../components/common/Toast";

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-[#fe4462]/30 border-t-[#fe4462] animate-spin" />
    </div>
  );
}

const WebsiteLayout = () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  return (
    <div className="bg-[#f0e0e3] dark:bg-[#0d0508] min-h-screen transition-colors duration-300">
      <ScrollProgress />
      <ScrollToTop />
      <ToastContainer />
      <Header />

      <main>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default WebsiteLayout;
