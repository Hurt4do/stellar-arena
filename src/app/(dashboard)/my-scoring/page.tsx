import { cookies } from "next/headers";
import MyScoringView from "@/features/my-scoring/MyScoringView";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getJudgeScores, getJudgeFeedback, type DbScore } from "@/lib/db/scores";
import { getRubricCriteria } from "@/lib/db/rubric";
import { COOKIE_JUDGE_ID, COOKIE_TRACK } from "@/lib/auth";

export default async function MyScoringPage() {
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;
  const currentTrack = cookies().get(COOKIE_TRACK)?.value ?? null;

  const [rawProjects, scores, feedback, criteria] = await Promise.all([
    getProjects().catch(() => []),
    judgeId ? getJudgeScores(judgeId).catch(() => []) : Promise.resolve([]),
    judgeId ? getJudgeFeedback(judgeId).catch(() => []) : Promise.resolve([]),
    getRubricCriteria(currentTrack ?? "genesis").catch(() => []),
  ]);

  const projects = rawProjects
    .map((p) => ({ ...p, track: normalizeTrack(p.track) ?? p.track }))
    .filter((p) => {
      if (!currentTrack) return true;
      return (p.track ?? "").toLowerCase() === currentTrack;
    });

  const scoredProjectIds = new Set(scores.map((s) => s.project_id));

  const scoreMap: Record<string, DbScore[]> = {};
  for (const s of scores) {
    if (!scoreMap[s.project_id]) scoreMap[s.project_id] = [];
    scoreMap[s.project_id].push(s);
  }

  const feedbackMap: Record<string, { final_comment: string | null; pitch_tags: string[] | null; outcome: string | null }> = {};
  for (const f of feedback) feedbackMap[f.project_id] = f;

  return (
    <MyScoringView
      projects={projects}
      scoredProjectIds={scoredProjectIds}
      judgeId={judgeId}
      scoreMap={scoreMap}
      feedbackMap={feedbackMap}
      criteria={criteria}
    />
  );
}
