import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow login page without authentication
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // protect admin pages
  if (pathname.startsWith("/admin")) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// IMPORTANT: match all admin pages EXCEPT login
export const config = {
  matcher: [
    "/admin/:path*",
    // BUT NOT /admin/login
  ],
};
