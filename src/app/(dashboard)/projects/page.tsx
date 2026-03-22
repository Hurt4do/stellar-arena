import { cookies } from "next/headers";
import ProjectsGridView from "@/features/projects/ProjectsGridView";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getJudgeScores, getLeaderboardScores } from "@/lib/db/scores";
import { COOKIE_JUDGE_ID, COOKIE_TRACK } from "@/lib/auth";
import type { Project } from "@/types/dashboard";

export default async function ProjectsPage() {
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;
  const rawTrack = cookies().get(COOKIE_TRACK)?.value ?? null;
  const defaultTrack = rawTrack as "genesis" | "scale" | null;

  let projects: Project[] = [];
  let scoredProjectIds: string[] = [];
  const evalCounts: Record<string, number> = {};
  let errorMessage: string | undefined;

  try {
    const [data, leaderboardScores] = await Promise.all([getProjects(), getLeaderboardScores()]);
    projects = data.map((p) => {
      const normalized = normalizeTrack(p.track) ?? p.track;
      return {
        ...p,
        track: normalized,
        description: p.team_description ?? undefined,
        team: p.team_members ?? undefined,
        tags: normalized ? [normalized] : [],
      };
    });
    for (const s of leaderboardScores) evalCounts[s.project_id] = s.judge_count;
  } catch (err) {
    errorMessage = String(err);
  }

  if (judgeId && !errorMessage) {
    try {
      const scores = await getJudgeScores(judgeId);
      const seen = new Set<string>();
      scoredProjectIds = scores.map((s) => s.project_id).filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    } catch {
      // Non-critical: scored badges just won't show
    }
  }

  return (
    <ProjectsGridView
      projects={projects}
      scoredProjectIds={scoredProjectIds}
      evalCounts={evalCounts}
      errorMessage={errorMessage}
      defaultTrack={defaultTrack}
    />
  );
}
