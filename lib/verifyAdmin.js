import { verifyToken } from "./auth";

export function verifyAdmin(req) {
  const token = req.cookies?.token;
  if (!token) return { ok: false, msg: "No token" };

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "admin")
    return { ok: false, msg: "Not authorized" };

  return { ok: true, user: decoded };
}
