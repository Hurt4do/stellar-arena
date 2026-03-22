import { createHash, timingSafeEqual } from "crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type Role = "builder" | "mentor" | "admin";

export const COOKIE_ROLE = "sa_role";
export const COOKIE_NAME = "sa_name";
export const COOKIE_TRACK = "sa_track";
export const COOKIE_JUDGE_ID = "sa_judge_id";

export const COOKIE_OPTS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 8, // 8 hours
};

function safeCompare(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return ha.length === hb.length && timingSafeEqual(ha, hb);
}

export function validatePasscode(role: Role, passcode: string): boolean {
  if (role === "builder") return true;
  if (role === "admin") {
    const expected = process.env.ADMIN_PASSCODE ?? "";
    return expected.length > 0 && safeCompare(passcode, expected);
  }
  if (role === "mentor") {
    const expected = process.env.MENTOR_PASSCODE ?? "";
    return expected.length > 0 && safeCompare(passcode, expected);
  }
  return false;
}

export function homeForRole(role: Role): string {
  return role === "builder" ? "/leaderboard" : "/overview";
}

export function canAccessPath(role: Role, pathname: string): boolean {
  // Admin can access everything
  if (role === "admin") return true;

  // Admin-only routes
  if (pathname.startsWith("/admin")) return false;

  // Leaderboard is accessible to all authenticated roles
  if (pathname.startsWith("/leaderboard")) return true;

  // Builder can only access leaderboard
  if (role === "builder") return false;

  // Mentor can access everything except admin
  return true;
}

export function getRoleFromCookies(cookieStore: ReadonlyRequestCookies): Role | null {
  const val = cookieStore.get(COOKIE_ROLE)?.value;
  if (val === "builder" || val === "mentor" || val === "admin") return val;
  return null;
}
