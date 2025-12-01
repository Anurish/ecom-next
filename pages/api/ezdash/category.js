export default async function handler(req, res) {
  try {
    const { category, page = 1, limit = 12 } = req.query;

    const apiUrl =
      "https://test2.ezdash.online/api/v1/product/list/?page=1&limit=200&store=online&stock=all";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.EZDASH_ACCESS_TOKEN}`,
        "x-refresh-token": process.env.EZDASH_REFRESH_TOKEN,
      },
    });

    const json = await response.json();
    const list = json?.data?.data || [];

    // MANUAL CATEGORY FILTER
    let filtered = list;

    if (category) {
      filtered = filtered.filter(
        (p) =>
          p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // PAGINATION
    const start = (page - 1) * limit;
    const end = start + Number(limit);

    const paginated = filtered.slice(start, end);

    return res.status(200).json({
      products: paginated,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.log("EZDash Error:", error);
    return res.status(500).json({ msg: "Failed to fetch category products" });
  }
}
