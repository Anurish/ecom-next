import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
}
