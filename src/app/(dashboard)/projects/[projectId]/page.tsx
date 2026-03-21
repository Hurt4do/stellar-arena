import ProjectSummaryView from "@/features/projects/ProjectSummaryView";

export default function ProjectSummaryRoute({
  params,
}: {
  params: { projectId: string };
}) {
  return <ProjectSummaryView projectId={params.projectId} />;
}

