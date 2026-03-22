import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { deleteAllProjects } from "@/lib/db/projects";

export async function POST() {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await deleteAllProjects();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
