import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName } from "@/lib/auth/session";

function isPublicAccountPath(pathname: string) {
  return pathname === "/account/login" || pathname === "/account/register";
}

function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(getSessionCookieName())?.value;

  if (pathname.startsWith("/admin") && !isPublicAdminPath(pathname) && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/account") && !isPublicAccountPath(pathname) && !token) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account", "/account/:path*"]
};
