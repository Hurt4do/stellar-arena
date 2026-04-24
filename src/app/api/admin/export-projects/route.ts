import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { getProjects } from "@/lib/db/projects";

function esc(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const projects = await getProjects();

    const headers = [
      "BUIDL ID", "Name", "Track", "Profile URL", "Demo Link", "GitHub",
      "Website", "Twitter", "Video Pitch", "Pitch Deck", "Docs URL", "Architecture URL",
      "Bounties", "Team Members", "Team Description", "Countries",
      "SCF Track Choice", "Budget (USD)",
      "Problem", "Solution", "Key Integrations", "Reviewer Feedback",
      "Score Overall", "Score Narrative", "Score Technical", "Score Feasibility", "Score Traction",
      "Review Status", "Submission Time", "Last Updated",
    ];

    const lines = [headers.map(esc).join(",")];
    for (const p of projects) {
      lines.push([
        esc(p.id), esc(p.name), esc(p.track), esc(p.profile_url), esc(p.demo_link), esc(p.github),
        esc(p.website), esc(p.twitter), esc(p.video_pitch), esc(p.pitch_deck), esc(p.docs_url), esc(p.architecture_url),
        esc(p.bounties), esc(p.team_members), esc(p.team_description), esc(p.countries),
        esc(p.scf_track_choice), esc(p.budget_usd),
        esc(p.problem), esc(p.solution), esc(p.key_integrations), esc(p.reviewer_feedback),
        esc(p.score_overall), esc(p.score_narrative), esc(p.score_technical), esc(p.score_feasibility), esc(p.score_traction),
        esc(p.review_status), esc(p.submission_time), esc(p.last_updated),
      ].join(","));
    }

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="projects.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
