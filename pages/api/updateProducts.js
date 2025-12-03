import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const EZ_API =
      "https://test2.ezdash.online/api/v1/product/list/?page=1&limit=200&store=online&stock=all";

    const response = await fetch(EZ_API, {
      headers: {
        accessToken: process.env.EZ_ACCESS_TOKEN,
        refreshToken: process.env.EZ_REFRESH_TOKEN,
      },
    });

    const json = await response.json();
    const list = json?.data?.data || [];

    const filePath = path.join(process.cwd(), "data", "products.json");
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));

    res.json({ success: true, count: list.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}
