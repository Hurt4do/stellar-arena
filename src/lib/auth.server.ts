import { createHash, timingSafeEqual } from "crypto";
import type { Role } from "@/lib/auth";

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
