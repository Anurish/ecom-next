import Stripe from "stripe";
import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ msg: "No session id" });

    await connectDB();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const orderId = session.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "processing",
      stripeSessionId: session_id,
    });

    return res.status(200).json({ msg: "Payment success", session });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
}
