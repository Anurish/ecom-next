import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { category, page = 1, limit = 12 } = req.query;

  // Load local JSON
  const filePath = path.join(process.cwd(), "data", "products.json");
  const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Normalize
  const readableCategory =
    category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase() || "";

  const filtered = fileData.filter((p) => {
    const cat = p.category?.name || p.category;
    return cat?.toLowerCase() === readableCategory.toLowerCase();
  });

  // Pagination
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + Number(limit));

  res.status(200).json({
    products: paginated,
    total: filtered.length,
    pages: Math.ceil(filtered.length / limit),
  });
}
