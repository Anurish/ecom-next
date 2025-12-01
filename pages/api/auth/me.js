import { verifyAdmin } from "../../../lib/verifyAdmin";
import User from "../../../models/User";
import { connectDB } from "../../../lib/db";

export default async function handler(req, res) {
  await connectDB();

  // ❗ MUST AWAIT verifyAdmin
  const auth = await verifyAdmin(req, res);

  if (!auth.ok) {
    return res.status(401).json({ msg: auth.msg });
  }

  const user = await User.findById(auth.user.id).select("-password");

  return res.status(200).json({ user });
}
