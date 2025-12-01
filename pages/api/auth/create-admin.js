import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  const email = "admin@example.com";
  const password = "123456";

  const hashed = await bcrypt.hash(password, 10);

  // Remove old admin if exists
  await User.deleteOne({ email });

  // Create new admin
  await User.create({
    email,
    password: hashed,
    role: "admin",
  });

  return res.json({ msg: "Admin created", email, password });
}
