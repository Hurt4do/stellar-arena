import { cookies } from "next/headers";
import MyScoringView from "@/features/my-scoring/MyScoringView";
import { getProjects } from "@/lib/db/projects";
import { getJudgeScores } from "@/lib/db/scores";
import { COOKIE_JUDGE_ID } from "@/lib/auth";

export default async function MyScoringPage() {
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;

  const [projects, scores] = await Promise.all([
    getProjects().catch(() => []),
    judgeId ? getJudgeScores(judgeId).catch(() => []) : Promise.resolve([]),
  ]);

  const scoredProjectIds = new Set(scores.map((s) => s.project_id));

  return (
    <MyScoringView
      projects={projects}
      scoredProjectIds={scoredProjectIds}
      judgeId={judgeId}
    />
  );
}
