export default async function handler(req, res) {
  try {
    const apiUrl =
      "https://test2.ezdash.online/api/v1/product/list/?page=1&limit=5&store=online&stock=all";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.EZDASH_ACCESS_TOKEN}`,
        "x-refresh-token": process.env.EZDASH_REFRESH_TOKEN,
      },
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.log("EZDash Error:", error);
    return res.status(500).json({ msg: "Failed to fetch products" });
  }
}
