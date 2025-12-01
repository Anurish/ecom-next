import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret123"; // Replace later with ENV

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { email, password } = req.body;

  console.log("BODY:", req.body); // <-- to debug empty fields

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid email or password" });

  // create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // set cookie
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
  );

  return res.status(200).json({ msg: "Login successful" });
}
