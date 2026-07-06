import { getFacebookPosts } from "../services/facebookService.js";

export async function listPosts(req, res, next) {
  try {
    const limit = Number(req.query.limit || 24);
    const data = await getFacebookPosts({ limit: Number.isFinite(limit) ? limit : 24 });
    res.json(data);
  } catch (error) {
    next(error);
  }
}
