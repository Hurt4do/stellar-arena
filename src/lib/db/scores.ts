import { supabase } from "@/lib/supabase";

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
