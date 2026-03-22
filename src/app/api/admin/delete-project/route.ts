import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { deleteProject } from "@/lib/db/projects";

export async function POST(req: NextRequest) {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let id: string | undefined;
  try {
    const body = await req.json();
    id = body.id;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  try {
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
