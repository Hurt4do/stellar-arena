import { supabase } from "@/lib/supabase";

export interface UpsertFeedbackInput {
  project_id: string;
  judge_id: string;
  final_comment?: string;
  pitch_tags?: string[];
  outcome?: string;
}

export async function upsertFeedback(input: UpsertFeedbackInput): Promise<void> {
  const { error } = await supabase
    .from("project_feedback")
    .upsert(input, { onConflict: "project_id,judge_id" });
  if (error) throw error;
}

export interface DbScore {
  id: string;
  project_id: string;
  judge_id: string;
  criterion_id: string;
  score: number;
  comments: string | null;
  pitch_tags: string[] | null;
  submitted_at: string;
}

export interface UpsertScoreInput {
  project_id: string;
  judge_id: string;
  criterion_id: string;
  score: number;
  comments?: string;
  pitch_tags?: string[];
}

export async function getProjectScores(projectId: string): Promise<DbScore[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("project_id", projectId);
  if (error) throw error;
  return data ?? [];
}

export async function getJudgeScores(judgeId: string): Promise<DbScore[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("judge_id", judgeId);
  if (error) throw error;
  return data ?? [];
}

export async function getJudgeProjectScores(judgeId: string, projectId: string): Promise<DbScore[]> {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("judge_id", judgeId)
    .eq("project_id", projectId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertScore(input: UpsertScoreInput): Promise<void> {
  const { error } = await supabase
    .from("scores")
    .upsert(input, { onConflict: "project_id,judge_id,criterion_id" });
  if (error) throw error;
}

export async function upsertScores(inputs: UpsertScoreInput[]): Promise<void> {
  const { error } = await supabase
    .from("scores")
    .upsert(inputs, { onConflict: "project_id,judge_id,criterion_id" });
  if (error) throw error;
}

export async function getJudgeProjectFeedback(judgeId: string, projectId: string): Promise<
  { final_comment: string | null; pitch_tags: string[] | null; outcome: string | null } | null
> {
  const { data, error } = await supabase
    .from("project_feedback")
    .select("final_comment, pitch_tags, outcome")
    .eq("judge_id", judgeId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getJudgeFeedback(judgeId: string): Promise<
  { project_id: string; final_comment: string | null; pitch_tags: string[] | null; outcome: string | null }[]
> {
  const { data, error } = await supabase
    .from("project_feedback")
    .select("project_id, final_comment, pitch_tags, outcome")
    .eq("judge_id", judgeId);
  if (error) throw error;
  return data ?? [];
}

export interface ScoreExportRow {
  project_name: string;
  track: string;
  judge_name: string;
  criterion_scores: Record<string, number>;
  total_pct: number;
  final_comment: string;
  pitch_tags: string;
  outcome: string;
  submitted_at: string;
}

export async function getAllScoresForExport(
  track: string
): Promise<{ criteria: { id: string; pillar_name: string; max_score: number; order_index: number }[]; rows: ScoreExportRow[] }> {
  // 1. Rubric criteria for the track (deduped by order_index)
  const { data: rawCriteria, error: critErr } = await supabase
    .from("rubric_criteria")
    .select("id, pillar_name, max_score, order_index")
    .eq("track", track)
    .order("order_index");
  if (critErr) throw critErr;
  const seen = new Set<number>();
  const criteria = (rawCriteria ?? []).filter((c) => {
    if (seen.has(c.order_index)) return false;
    seen.add(c.order_index);
    return true;
  });

  // 2. All projects (filter to track in JS since raw values vary)
  const { data: allProjects, error: projErr } = await supabase
    .from("projects")
    .select("id, name, track");
  if (projErr) throw projErr;
  const trackProjects = (allProjects ?? []).filter(
    (p) => (p.track ?? "").toLowerCase() === track.toLowerCase()
  );
  const projectIds = trackProjects.map((p) => p.id);
  const projectMap: Record<string, { name: string; track: string }> = {};
  for (const p of trackProjects) projectMap[p.id] = { name: p.name, track: p.track ?? "" };

  if (projectIds.length === 0) return { criteria, rows: [] };

  // 3. Judges
  const { data: judges, error: judgeErr } = await supabase.from("judges").select("id, name");
  if (judgeErr) throw judgeErr;
  const judgeMap: Record<string, string> = {};
  for (const j of judges ?? []) judgeMap[j.id] = j.name;

  // 4. Scores for these projects
  const { data: scores, error: scoresErr } = await supabase
    .from("scores")
    .select("project_id, judge_id, criterion_id, score, submitted_at")
    .in("project_id", projectIds);
  if (scoresErr) throw scoresErr;

  // 5. Feedback for these projects
  const { data: feedback, error: feedErr } = await supabase
    .from("project_feedback")
    .select("project_id, judge_id, final_comment, pitch_tags, outcome")
    .in("project_id", projectIds);
  if (feedErr) throw feedErr;
  const feedbackMap: Record<string, { final_comment: string | null; pitch_tags: string[] | null; outcome: string | null }> = {};
  for (const f of feedback ?? []) feedbackMap[`${f.project_id}:${f.judge_id}`] = f;

  // 6. Group scores by (project_id, judge_id)
  const submissions: Record<string, { project_id: string; judge_id: string; scoresByCriterion: Record<string, number>; submitted_at: string }> = {};
  for (const s of scores ?? []) {
    const key = `${s.project_id}:${s.judge_id}`;
    if (!submissions[key]) {
      submissions[key] = { project_id: s.project_id, judge_id: s.judge_id, scoresByCriterion: {}, submitted_at: s.submitted_at };
    }
    submissions[key].scoresByCriterion[s.criterion_id] = s.score;
    if (s.submitted_at > submissions[key].submitted_at) submissions[key].submitted_at = s.submitted_at;
  }

  const maxTotal = criteria.reduce((a, c) => a + c.max_score, 0);
  const rows: ScoreExportRow[] = Object.values(submissions).map((sub) => {
    const rawTotal = criteria.reduce((a, c) => a + (sub.scoresByCriterion[c.id] ?? 0), 0);
    const fb = feedbackMap[`${sub.project_id}:${sub.judge_id}`];
    return {
      project_name: projectMap[sub.project_id]?.name ?? sub.project_id,
      track: projectMap[sub.project_id]?.track ?? "",
      judge_name: judgeMap[sub.judge_id] ?? sub.judge_id,
      criterion_scores: sub.scoresByCriterion,
      total_pct: maxTotal > 0 ? Math.round((rawTotal / maxTotal) * 1000) / 10 : 0,
      final_comment: fb?.final_comment ?? "",
      pitch_tags: (fb?.pitch_tags ?? []).join(", "),
      outcome: fb?.outcome ?? "",
      submitted_at: sub.submitted_at,
    };
  });

  rows.sort((a, b) => a.project_name.localeCompare(b.project_name) || a.judge_name.localeCompare(b.judge_name));
  return { criteria, rows };
}

// Returns { projectId -> averageScore (0-100) } across all judges
export async function getLeaderboardScores(): Promise<
  { project_id: string; avg_score: number; judge_count: number }[]
> {
  // Fetch all scores with their rubric criteria for weighting
  const { data: scores, error: scoresErr } = await supabase
    .from("scores")
    .select("project_id, judge_id, criterion_id, score");
  if (scoresErr) throw scoresErr;

  const { data: criteria, error: critErr } = await supabase
    .from("rubric_criteria")
    .select("id, max_score");
  if (critErr) throw critErr;

  if (!scores || !criteria) return [];

  const maxMap: Record<string, number> = {};
  for (const c of criteria) maxMap[c.id] = c.max_score;

  // Group by project + judge, compute weighted total per submission
  type Submission = { raw: number; max: number };
  const byProjJudge: Record<string, Record<string, Submission>> = {};

  for (const s of scores) {
    if (!byProjJudge[s.project_id]) byProjJudge[s.project_id] = {};
    if (!byProjJudge[s.project_id][s.judge_id]) {
      byProjJudge[s.project_id][s.judge_id] = { raw: 0, max: 0 };
    }
    byProjJudge[s.project_id][s.judge_id].raw += s.score;
    byProjJudge[s.project_id][s.judge_id].max += maxMap[s.criterion_id] ?? 0;
  }

  return Object.entries(byProjJudge).map(([project_id, judges]) => {
    const judgeScores = Object.values(judges).map(({ raw, max }) =>
      max > 0 ? (raw / max) * 100 : 0
    );
    const avg_score =
      judgeScores.reduce((a, b) => a + b, 0) / judgeScores.length;
    return {
      project_id,
      avg_score: Math.round(avg_score * 10) / 10,
      judge_count: judgeScores.length,
    };
  });
}
