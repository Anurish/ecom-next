export default function handler(req, res) {
  res.setHeader("Set-Cookie", [
    `accessToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`,
    `refreshToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`,
  ]);

  return res.status(200).json({ msg: "Logged out" });
}
