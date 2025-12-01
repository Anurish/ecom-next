
export const clearAuthCookie = (res) => {
  res.setHeader("Set-Cookie", "refreshToken=; Max-Age=0; Path=/;");
};
