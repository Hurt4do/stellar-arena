import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { getAllScoresForExport } from "@/lib/db/scores";

function esc(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const track = (new URL(req.url).searchParams.get("track") ?? "genesis").toLowerCase();
  if (track !== "genesis" && track !== "scale") {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }

  try {
    const { criteria, rows } = await getAllScoresForExport(track);

    const headers = [
      "Project Name",
      "Track",
      "Judge Name",
      ...criteria.map((c) => c.pillar_name),
      "Total (%)",
      "Final Comment",
      "Pitch Tags",
      "Outcome",
      "Submitted At",
    ];

    const lines = [headers.map(esc).join(",")];
    for (const row of rows) {
      lines.push(
        [
          esc(row.project_name),
          esc(row.track),
          esc(row.judge_name),
          ...criteria.map((c) => esc(row.criterion_scores[c.id] ?? 0)),
          esc(row.total_pct),
          esc(row.final_comment),
          esc(row.pitch_tags),
          esc(row.outcome),
          esc(row.submitted_at),
        ].join(",")
      );
    }

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="scores_${track}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
