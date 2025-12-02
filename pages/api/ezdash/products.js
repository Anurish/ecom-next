let cache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 3; // 3 minutes

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // Serve cached data for 3 minutes (massive speed boost)
    if (cache && now - lastFetchTime < CACHE_DURATION) {
      return res.status(200).json(cache);
    }

    const apiUrl =
      "https://test2.ezdash.online/api/v1/product/list/?page=1&limit=5&store=online&stock=all";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.EZDASH_ACCESS_TOKEN}`,
        "x-refresh-token": process.env.EZDASH_REFRESH_TOKEN,
      },
    });

    // if EZDash API fails (expired token, etc.)
    if (!response.ok) {
      const errText = await response.text();
      console.error("EZDash API Error:", response.status, errText);
      return res.status(response.status).json({
        success: false,
        msg: "EZDash API request failed",
        error: errText,
      });
    }

    const data = await response.json();

    // cache response
    cache = data;
    lastFetchTime = now;

    return res.status(200).json(data);
  } catch (error) {
    console.error("EZDash API Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch products",
      error: error.message,
    });
  }
}
