import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const order = await Order.create(req.body);
      return res.status(201).json(order);
    } catch (e) {
      return res.status(500).json({ msg: "Error creating order" });
    }
  }

  const orders = await Order.find().sort({ createdAt: -1 });
  return res.status(200).json(orders);
}
