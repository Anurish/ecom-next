import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    const list = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Pick first 4 products (later you can add sorting logic)
    const best = list.slice(0, 4);

    return res.status(200).json({ products: best });
  } catch (error) {
    console.error("Local BestSelling Error:", error);
    return res.status(500).json({ msg: "Failed to load products" });
  }
}
