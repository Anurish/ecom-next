import cookie from "cookie";

export function parseCookies(req) {
  if (!req.headers || !req.headers.cookie) return {};
  return cookie.parse(req.headers.cookie || "");
}
