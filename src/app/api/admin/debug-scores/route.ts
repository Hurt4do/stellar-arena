import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoleFromCookies } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const role = getRoleFromCookies(cookies());
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    { data: scores },
    { data: criteria },
    { data: feedback },
  ] = await Promise.all([
    supabase.from("scores").select("project_id, judge_id, criterion_id, score"),
    supabase.from("rubric_criteria").select("id, track, pillar_name, order_index, max_score"),
    supabase.from("project_feedback").select("project_id, judge_id"),
  ]);

  const criteriaIds = new Set((criteria ?? []).map((c) => c.id));
  const scoreCriterionIds = [...new Set((scores ?? []).map((s) => s.criterion_id))];
  const matchedIds = scoreCriterionIds.filter((id) => criteriaIds.has(id));
  const unmatchedIds = scoreCriterionIds.filter((id) => !criteriaIds.has(id));

  return NextResponse.json({
    scores_count: scores?.length ?? 0,
    feedback_count: feedback?.length ?? 0,
    rubric_criteria_count: criteria?.length ?? 0,
    rubric_criteria: criteria ?? [],
    distinct_criterion_ids_in_scores: scoreCriterionIds,
    matched_criterion_ids: matchedIds,
    unmatched_criterion_ids: unmatchedIds,
    diagnosis: unmatchedIds.length > 0
      ? "MISMATCH: scores reference criterion_ids not in rubric_criteria. Scores exist but cannot be weighted."
      : matchedIds.length > 0
      ? "OK: scores match rubric_criteria correctly."
      : scores && scores.length > 0
      ? "WARNING: scores exist but rubric_criteria is empty — cannot compute weighted totals."
      : "No scores in database yet.",
  });
}
