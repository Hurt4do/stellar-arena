import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: scores } = await supabase
    .from("scores")
    .select("project_id, judge_id, criterion_id, score");

  const { data: criteria } = await supabase
    .from("rubric_criteria")
    .select("id, track, pillar_name, max_score");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, track");

  const maxMap: Record<string, number | null> = {};
  for (const c of criteria ?? []) maxMap[c.id] = c.max_score;

  const trackMap: Record<string, string> = {};
  for (const p of projects ?? []) trackMap[p.id] = p.track ?? "Unknown";

  // Group by project + judge
  const byProjJudge: Record<string, Record<string, { raw: number; max: number; criterionIds: string[] }>> = {};
  for (const s of scores ?? []) {
    if (!byProjJudge[s.project_id]) byProjJudge[s.project_id] = {};
    if (!byProjJudge[s.project_id][s.judge_id]) {
      byProjJudge[s.project_id][s.judge_id] = { raw: 0, max: 0, criterionIds: [] };
    }
    byProjJudge[s.project_id][s.judge_id].raw += s.score;
    byProjJudge[s.project_id][s.judge_id].max += maxMap[s.criterion_id] ?? 0;
    byProjJudge[s.project_id][s.judge_id].criterionIds.push(s.criterion_id);
  }

  // Build summary per project
  const projectSummaries = Object.entries(byProjJudge).map(([project_id, judges]) => {
    const judgeScores = Object.values(judges).map(({ raw, max }) =>
      max > 0 ? (raw / max) * 100 : 0
    );
    const avg_score = judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length;
    const sampleJudge = Object.values(judges)[0];
    return {
      project_id,
      project_track: trackMap[project_id] ?? "Unknown",
      avg_score: Math.round(avg_score * 10) / 10,
      judge_count: judgeScores.length,
      sample_raw: sampleJudge.raw,
      sample_max: sampleJudge.max,
      sample_criterion_ids: sampleJudge.criterionIds,
    };
  });

  // Criterion ID → max_score mapping (only for IDs used in scores)
  const usedCriterionIds = [...new Set((scores ?? []).map((s) => s.criterion_id))];
  const criterionMaxScores: Record<string, number | null> = {};
  for (const id of usedCriterionIds) criterionMaxScores[id] = maxMap[id] ?? null;

  return NextResponse.json({
    total_scores: scores?.length ?? 0,
    criterion_max_scores: criterionMaxScores,
    projects: projectSummaries.sort((a, b) => a.project_track.localeCompare(b.project_track)),
  });
}
