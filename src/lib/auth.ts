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

export function homeForRole(role: Role): string {
  return role === "builder" ? "/leaderboard" : "/overview";
}

export function canAccessPath(role: Role, pathname: string): boolean {
  if (role === "admin") return true;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/leaderboard")) return true;
  if (role === "builder") return false;
  return true;
}

// Works with both next/headers cookies() and middleware request.cookies
export function getRoleFromCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): Role | null {
  const val = cookieStore.get(COOKIE_ROLE)?.value;
  if (val === "builder" || val === "mentor" || val === "admin") return val;
  return null;
}
