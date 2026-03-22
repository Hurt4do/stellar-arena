import { getProject, normalizeTrack } from "@/lib/db/projects";
import ProjectSummaryView from "@/features/projects/ProjectSummaryView";

export default async function ProjectSummaryRoute({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId).catch(() => null);
  const normalized = project
    ? { ...project, track: normalizeTrack(project.track) ?? project.track }
    : null;
  return <ProjectSummaryView project={normalized} />;
}
