import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, default: null },
    paymentIntentId: { type: String, default: null },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    billing: {
      name: String,
      email: String,
      phone: String,
      country: String,
      street: String,
      city: String,
      postal: String,
      state: String,
    },

    total: Number,

    paymentStatus: { type: String, default: "unpaid" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
