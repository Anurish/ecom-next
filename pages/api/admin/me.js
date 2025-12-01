import { verifyAdmin } from "../../../lib/verifyAdmin";

export default function handler(req, res) {
  const auth = verifyAdmin(req);

  if (!auth.ok) return res.status(401).json({ msg: auth.msg });

  res.json({ user: auth.user });
}
