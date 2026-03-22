import { NextRequest, NextResponse } from "next/server";
import { COOKIE_ROLE, COOKIE_TRACK, COOKIE_OPTS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const role = req.cookies.get(COOKIE_ROLE)?.value;
  if (role !== "mentor" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const track = body?.track;
  if (track !== "genesis" && track !== "scale") {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_TRACK, track, COOKIE_OPTS);
  return res;
}
