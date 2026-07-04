import { getLatestReels } from "../services/instagramService.js";

/**
 * Thin controller: read query input, call the service, shape the response.
 * Errors are forwarded to the central handler so the token / raw upstream
 * payload never reach the client.
 */

// GET /api/instagram/reels?limit=
export async function listReels(req, res, next) {
  try {
    const { limit } = req.query;
    const result = await getLatestReels({ limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
