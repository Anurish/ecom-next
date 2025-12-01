import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    "secret123",
    { expiresIn: "1d" }
  );
}
