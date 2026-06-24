import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split large, stable vendors into their own long-cacheable chunks so a
    // code change doesn't bust the cache for three.js / framer-motion, and the
    // browser can fetch them in parallel.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/") || id.includes("@react-three")) return "three";
          if (id.includes("framer-motion")) return "motion";
          if (
            id.includes("/react-router") ||
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/scheduler/")
          )
            return "react-vendor";
        },
      },
    },
    // Three.js chunks are legitimately large; silence the noisy 500kB warning.
    chunkSizeWarningLimit: 1500,
  },
});
