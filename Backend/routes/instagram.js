import { Router } from "express";
import { listReels } from "../controllers/instagramController.js";

const router = Router();

// Latest reels for the configured account (newest first, deduped).
router.get("/reels", listReels);

export default router;
