import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ROLE, canAccessPath, homeForRole, type Role } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow login page and auth API
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    const role = req.cookies.get(COOKIE_ROLE)?.value as Role | undefined;
    // If already logged in and hitting /login, redirect to home
    if (pathname === "/login" && role && (role === "builder" || role === "mentor" || role === "admin")) {
      return NextResponse.redirect(new URL(homeForRole(role), req.url));
    }
    return NextResponse.next();
  }

  const roleVal = req.cookies.get(COOKIE_ROLE)?.value;
  const role = (roleVal === "builder" || roleVal === "mentor" || roleVal === "admin")
    ? roleVal as Role
    : null;

  // Unauthenticated → redirect to login
  if (!role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check path access
  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
};
