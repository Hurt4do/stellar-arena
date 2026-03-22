import { cookies } from "next/headers";
import EvaluationStepOneView from "@/features/evaluation/EvaluationStepOneView";
import { getProject, normalizeTrack } from "@/lib/db/projects";
import { getRubricCriteria } from "@/lib/db/rubric";
import type { DbRubricCriterion } from "@/lib/db/rubric";
import { COOKIE_JUDGE_ID } from "@/lib/auth";

export default async function EvaluationStepOnePage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  const track = normalizeTrack(project?.track ?? null) ?? "Genesis";
  const judgeId = cookies().get(COOKIE_JUDGE_ID)?.value ?? null;
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
      judgeId={judgeId}
    />
  );
}
