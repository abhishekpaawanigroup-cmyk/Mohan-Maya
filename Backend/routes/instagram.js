import { Router } from "express";
import { listReels, proxyImage } from "../controllers/instagramController.js";

const router = Router();

// Latest reels for the configured account (newest first, deduped).
router.get("/reels", listReels);

// Image proxy: fetches an Instagram CDN image server-side and streams it
// to the browser so the session-bound signed URLs resolve correctly.
// Usage: /api/instagram/img?url=<encoded-cdn-url>
router.get("/img", proxyImage);

export default router;
