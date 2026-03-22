import { NextResponse } from "next/server";
import { COOKIE_ROLE, COOKIE_NAME, COOKIE_TRACK, COOKIE_JUDGE_ID } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const clear = { httpOnly: true, path: "/", sameSite: "lax" as const, maxAge: 0 };
  res.cookies.set(COOKIE_ROLE, "", clear);
  res.cookies.set(COOKIE_NAME, "", clear);
  res.cookies.set(COOKIE_TRACK, "", clear);
  res.cookies.set(COOKIE_JUDGE_ID, "", clear);
  return res;
}
