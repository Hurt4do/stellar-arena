import { cookies } from "next/headers";
import MyScoringView from "@/features/my-scoring/MyScoringView";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getJudgeScores } from "@/lib/db/scores";
import { COOKIE_JUDGE_ID, COOKIE_TRACK } from "@/lib/auth";

export default async function MyScoringPage() {
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;
  const currentTrack = cookies().get(COOKIE_TRACK)?.value ?? null;

  const [rawProjects, scores] = await Promise.all([
    getProjects().catch(() => []),
    judgeId ? getJudgeScores(judgeId).catch(() => []) : Promise.resolve([]),
  ]);

  // Normalize tracks and filter by current judge track
  const projects = rawProjects
    .map((p) => ({ ...p, track: normalizeTrack(p.track) ?? p.track }))
    .filter((p) => {
      if (!currentTrack) return true;
      return (p.track ?? "").toLowerCase() === currentTrack;
    });

  const scoredProjectIds = new Set(scores.map((s) => s.project_id));

  return (
    <MyScoringView
      projects={projects}
      scoredProjectIds={scoredProjectIds}
      judgeId={judgeId}
    />
  );
}
