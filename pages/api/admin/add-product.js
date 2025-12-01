import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";
import slugify from "slugify";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    const { name, price, category, stock, description, image } = req.body;

    if (!name || !price || !category || !stock || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const slug = slugify(name, { lower: true });

    const product = await Product.create({
      name,
      slug,
      price,
      stock,
      category,
      description,
      images: [image || "/placeholder.jpg"],
    });

    return res.status(200).json({
      msg: "Product added successfully",
      product,
    });

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
}
