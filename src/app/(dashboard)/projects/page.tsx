import { cookies } from "next/headers";
import ProjectsGridView from "@/features/projects/ProjectsGridView";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getJudgeScores } from "@/lib/db/scores";
import { COOKIE_JUDGE_ID, COOKIE_TRACK } from "@/lib/auth";
import type { Project } from "@/types/dashboard";

export default async function ProjectsPage() {
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;
  const rawTrack = cookies().get(COOKIE_TRACK)?.value ?? null;
  const defaultTrack = rawTrack as "genesis" | "scale" | null;

  let projects: Project[] = [];
  let scoredProjectIds: string[] = [];
  let errorMessage: string | undefined;

  try {
    const data = await getProjects();
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
      errorMessage={errorMessage}
      defaultTrack={defaultTrack}
    />
  );
}
