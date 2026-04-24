import { cookies } from "next/headers";
import ProjectsGridView from "@/features/projects/ProjectsGridView";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getProjectEvalCounts } from "@/lib/db/scores";
import { COOKIE_TRACK } from "@/lib/auth";
import type { Project } from "@/types/dashboard";

export default async function ProjectsPage() {
  const rawTrack = cookies().get(COOKIE_TRACK)?.value ?? null;
  const defaultTrack = rawTrack as "genesis" | "scale" | null;

  let projects: Project[] = [];
  const evalCounts: Record<string, number> = {};
  let errorMessage: string | undefined;

  try {
    const [data, counts] = await Promise.all([getProjects(), getProjectEvalCounts()]);
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
    Object.assign(evalCounts, counts);
  } catch (err) {
    errorMessage = String(err);
  }

  return (
    <ProjectsGridView
      projects={projects}
      evalCounts={evalCounts}
      errorMessage={errorMessage}
      defaultTrack={defaultTrack}
    />
  );
}
