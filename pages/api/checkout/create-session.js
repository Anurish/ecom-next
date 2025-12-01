import Stripe from "stripe";
import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    await connectDB();

    const { cart, billing } = req.body;

    console.log("Incoming Checkout Payload:", req.body);

    if (!cart || cart.length === 0) {
      return res.status(400).json({ msg: "Cart empty" });
    }

    if (!billing) {
      return res.status(400).json({ msg: "Billing information missing" });
    }

    // Stripe line items
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // CREATE ORDER BEFORE REDIRECT
    const order = await Order.create({
      items: cart,
      billing,
      total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      paymentStatus: "unpaid",
      status: "pending",
    });

    console.log("Order Created:", order._id);

    // CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      metadata: {
        orderId: String(order._id),
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/cancel`,
    });

    // SAVE session ID in DB
    await Order.findByIdAndUpdate(order._id, {
      stripeSessionId: session.id,
    });

    console.log("Stripe session created:", session.id);

    // RETURN STRIPE REDIRECT URL
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.log("SESSION ERROR:", err);
    return res.status(500).json({ msg: "Stripe session creation failed" });
  }
}
