import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

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
    .select("id, max_score");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, track");

  const { data: feedback } = await supabase
    .from("project_feedback")
    .select("project_id, judge_id");

  const { data: judges } = await supabase
    .from("judges")
    .select("id, name");

  const maxMap: Record<string, number> = {};
  for (const c of criteria ?? []) maxMap[c.id] = c.max_score;

  const projectNameMap: Record<string, string> = {};
  const projectTrackMap: Record<string, string> = {};
  for (const p of projects ?? []) {
    projectNameMap[p.id] = p.name;
    projectTrackMap[p.id] = p.track ?? "Unknown";
  }

  const judgeNameMap: Record<string, string> = {};
  for (const j of judges ?? []) judgeNameMap[j.id] = j.name;

  // --- Scores table summary ---
  const byProjJudge: Record<string, Record<string, { raw: number; max: number }>> = {};
  for (const s of scores ?? []) {
    if (!byProjJudge[s.project_id]) byProjJudge[s.project_id] = {};
    if (!byProjJudge[s.project_id][s.judge_id]) {
      byProjJudge[s.project_id][s.judge_id] = { raw: 0, max: 0 };
    }
    byProjJudge[s.project_id][s.judge_id].raw += s.score;
    byProjJudge[s.project_id][s.judge_id].max += maxMap[s.criterion_id] ?? 0;
  }

  const scoredProjects = Object.entries(byProjJudge).map(([project_id, judgesMap]) => {
    const judgeScores = Object.values(judgesMap).map(({ raw, max }) =>
      max > 0 ? (raw / max) * 100 : 0
    );
    const avg_score = judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length;
    return {
      project_id,
      project_name: projectNameMap[project_id] ?? project_id,
      project_track: projectTrackMap[project_id] ?? "Unknown",
      avg_score: Math.round(avg_score * 10) / 10,
      judge_count: judgeScores.length,
      judges: Object.keys(judgesMap).map((jid) => judgeNameMap[jid] ?? jid),
    };
  }).sort((a, b) => a.project_track.localeCompare(b.project_track) || a.project_name.localeCompare(b.project_name));

  // --- Feedback table summary (feedback-only = no score rows) ---
  const feedbackCounts: Record<string, { count: number; judges: string[] }> = {};
  for (const f of feedback ?? []) {
    if (!feedbackCounts[f.project_id]) feedbackCounts[f.project_id] = { count: 0, judges: [] };
    feedbackCounts[f.project_id].count += 1;
    feedbackCounts[f.project_id].judges.push(judgeNameMap[f.judge_id] ?? f.judge_id);
  }

  const scoredProjectIds = new Set(Object.keys(byProjJudge));
  const feedbackOnlyProjects = Object.entries(feedbackCounts)
    .filter(([id]) => !scoredProjectIds.has(id))
    .map(([project_id, { count, judges }]) => ({
      project_id,
      project_name: projectNameMap[project_id] ?? project_id,
      project_track: projectTrackMap[project_id] ?? "Unknown",
      feedback_count: count,
      judges,
    }))
    .sort((a, b) => a.project_track.localeCompare(b.project_track) || a.project_name.localeCompare(b.project_name));

  return NextResponse.json({
    total_scores: scores?.length ?? 0,
    total_feedback: feedback?.length ?? 0,
    scored_projects: scoredProjects,
    feedback_only_projects: feedbackOnlyProjects,
  });
}
