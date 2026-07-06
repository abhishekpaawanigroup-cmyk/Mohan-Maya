import axios from "axios";
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

/**
 * GET /api/instagram/img?url=<encoded-cdn-url>
 *
 * Instagram CDN images use session-bound signed URLs that return 403 when a
 * browser fetches them directly from a non-Instagram origin. This proxy fetches
 * the image server-side (where there are no CORS/origin restrictions) and
 * streams the bytes back to the browser with the correct Content-Type header.
 *
 * Security: only allows instagram CDN hostnames so this cannot be misused as a
 * generic open-proxy.
 */
const ALLOWED_HOSTS = /^scontent[-a-z0-9]*\.(cdninstagram\.com|fbcdn\.net|instagram\.com)$/i;
const PROXY_TIMEOUT = 15_000; // 15 s

export async function proxyImage(req, res, next) {
  try {
    const raw = req.query.url;
    if (!raw) return res.status(400).json({ error: "url query param required" });

    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    if (!ALLOWED_HOSTS.test(parsed.hostname)) {
      return res.status(403).json({ error: "Disallowed host" });
    }

    const upstream = await axios.get(raw, {
      responseType: "stream",
      timeout: PROXY_TIMEOUT,
      headers: {
        // Mimic a real browser to satisfy Instagram CDN signing requirements.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
      },
    });

    const ct = upstream.headers["content-type"] || "image/jpeg";
    res.setHeader("Content-Type", ct);
    // Allow browser to cache the proxied image for up to 10 minutes.
    res.setHeader("Cache-Control", "public, max-age=600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    upstream.data.pipe(res);
  } catch (err) {
    // Upstream returned an error status → pass a meaningful response.
    if (err.response) {
      return res
        .status(err.response.status || 502)
        .json({ error: "Upstream image fetch failed", status: err.response.status });
    }
    next(err);
  }
}

