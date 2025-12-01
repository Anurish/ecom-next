import { connectDB } from "../../../lib/db";
import { verifyAdmin } from "../../../lib/verifyAdmin";
import { parseCookies } from "../../../lib/parseCookies";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  await connectDB();

  req.cookies = parseCookies(req);

  const auth = verifyAdmin(req, res);
  if (!auth.ok) return res.status(401).json({ msg: auth.msg });

  const orders = await Order.find().sort({ createdAt: -1 });

  return res.status(200).json({ orders });
}
