import ProjectDetailsView from "@/features/project-details/ProjectDetailsView";

export default function ProjectDetailsRoute({
  params,
}: {
  params: { projectId: string };
}) {
  return <ProjectDetailsView projectId={params.projectId} />;
}

