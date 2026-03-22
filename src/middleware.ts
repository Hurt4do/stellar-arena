import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ROLE, canAccessPath, homeForRole, type Role } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow auth API
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const roleVal = req.cookies.get(COOKIE_ROLE)?.value;
  const role = (roleVal === "builder" || roleVal === "mentor" || roleVal === "admin")
    ? roleVal as Role
    : null;

  // Login page: let through if unauthenticated, redirect home if already logged in
  if (pathname.startsWith("/login")) {
    if (role) return NextResponse.redirect(new URL(homeForRole(role), req.url));
    return NextResponse.next();
  }

  // Root page or unauthenticated → redirect to login
  if (!role) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Root "/" → redirect to role home directly
  if (pathname === "/") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  // Check path access for all other routes
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
