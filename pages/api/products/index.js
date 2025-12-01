import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";
import slugify from "slugify";
import { verifyAdmin } from "../../../lib/verifyAdmin";

export default async function handler(req, res) {
  await connectDB();

  // PUBLIC GET
 // GET — list products with pagination + category filter
if (req.method === "GET") {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const category = req.query.category;

  const filter = category ? { category } : {};

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return res.status(200).json({
    products,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
}


  // ADMIN CHECK FOR WRITE OPERATIONS
  const auth = verifyAdmin(req, res);
  if (!auth.ok) return res.status(401).json({ msg: auth.msg });

  // CREATE PRODUCT
  if (req.method === "POST") {
    try {
      const { name, price, category, stock, description, image } = req.body;
      const slug = slugify(name, { lower: true });

      const product = await Product.create({
        name,
        slug,
        price,
        stock,
        category,
        description,
        images: [image],
      });

      return res.status(201).json({ msg: "Product created", product });
    } catch (err) {
      return res.status(500).json({ msg: "Server error", err });
    }
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
