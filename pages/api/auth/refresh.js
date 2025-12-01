import { verifyRefreshToken, generateAccessToken } from "../../../lib/auth";
import User from "../../../models/User";
import { connectDB } from "../../../lib/db";

export default async function handler(req, res) {
  await connectDB();

  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "No refresh token" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    const newAccess = generateAccessToken(user);

    res.setHeader(
      "Set-Cookie",
      `accessToken=${newAccess}; HttpOnly; Path=/; Max-Age=900; Secure; SameSite=Strict`
    );

    return res.status(200).json({ msg: "Token refreshed" });
  } catch (e) {
    return res.status(403).json({ msg: "Invalid refresh token" });
  }
}
