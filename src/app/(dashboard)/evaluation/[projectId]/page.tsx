import EvaluationStepOneView from "@/features/evaluation/EvaluationStepOneView";
import { getProject } from "@/lib/db/projects";
import { getRubricCriteria } from "@/lib/db/rubric";
import type { DbRubricCriterion } from "@/lib/db/rubric";

export default async function EvaluationStepOnePage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  const track = project?.track ?? "Genesis";
  let criteria: DbRubricCriterion[] = [];
  try {
    criteria = await getRubricCriteria(track);
  } catch {
    // Supabase not configured — view will show an error state
  }

  return (
    <EvaluationStepOneView
      projectId={params.projectId}
      projectName={project?.name ?? params.projectId}
      track={track}
      criteria={criteria}
    />
  );
}
