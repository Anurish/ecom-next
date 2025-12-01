import Stripe from "stripe";
import { buffer } from "micro";
import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed", err.message);
    return res.status(400).send("Webhook Error");
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        paymentStatus: "paid",
        status: "confirmed",
        paymentIntentId: session.payment_intent,
      }
    );
  }

  res.json({ received: true });
}
