import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  // simple check
  if (req.headers.cookie?.includes("admin=1") === false)
    return res.status(401).json({ msg: "Access denied" });

  const products = await Product.find().sort({ createdAt: -1 });

  return res.status(200).json({ products });
}
