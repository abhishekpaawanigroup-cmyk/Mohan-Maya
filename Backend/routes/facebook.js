import express from "express";
import { listPosts } from "../controllers/facebookController.js";

const router = express.Router();

router.get("/posts", listPosts);

export default router;
