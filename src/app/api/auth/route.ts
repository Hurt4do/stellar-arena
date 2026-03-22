import { NextRequest, NextResponse } from "next/server";
import { validatePasscode, COOKIE_ROLE, COOKIE_NAME, COOKIE_TRACK, COOKIE_JUDGE_ID, COOKIE_OPTS, type Role } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { role, passcode = "", name = "", track = "" } = body as {
    role: string;
    passcode: string;
    name: string;
    track: string;
  };

  if (role !== "builder" && role !== "mentor" && role !== "admin") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const typedRole = role as Role;

  if (!validatePasscode(typedRole, passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  if (typedRole === "mentor" && !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Upsert judge row in Supabase for mentor/admin
  let judgeId = "";
  if (typedRole === "mentor" || typedRole === "admin") {
    const judgeName = typedRole === "mentor" ? name.trim() : "Admin";
    try {
      const { data: existing } = await supabase
        .from("judges")
        .select("id")
        .eq("name", judgeName)
        .maybeSingle();

      if (existing?.id) {
        judgeId = existing.id;
      } else {
        const { data: created, error } = await supabase
          .from("judges")
          .insert({ name: judgeName })
          .select("id")
          .single();
        if (error) throw error;
        judgeId = created.id;
      }
    } catch {
      // Non-fatal: judge ID will be empty, scoring won't work but login succeeds
    }
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE_ROLE, typedRole, COOKIE_OPTS);
  res.cookies.set(COOKIE_NAME, encodeURIComponent(name.trim()), COOKIE_OPTS);
  res.cookies.set(COOKIE_TRACK, track || "", COOKIE_OPTS);
  res.cookies.set(COOKIE_JUDGE_ID, judgeId, COOKIE_OPTS);

  return res;
}
