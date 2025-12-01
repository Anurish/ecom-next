import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";
import { verifyAdmin } from "../../../lib/verifyAdmin";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === "GET") {
    const auth = verifyAdmin(req, res);
    if (!auth.ok) return res.status(401).json({ msg: auth.msg });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    return res.status(200).json({ order });
  }

  if (req.method === "PUT") {
    const auth = verifyAdmin(req, res);
    if (!auth.ok) return res.status(401).json({ msg: auth.msg });

    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    );

    return res.json({ msg: "Order updated", order });
  }

  if (req.method === "DELETE") {
    const auth = verifyAdmin(req, res);
    if (!auth.ok) return res.status(401).json({ msg: auth.msg });

    await Order.findByIdAndDelete(id);
    return res.json({ msg: "Order deleted" });
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
