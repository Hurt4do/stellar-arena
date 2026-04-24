import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export interface DbRubricCriterion {
  id: string;
  track: string;
  pillar_name: string;
  description: string | null;
  max_score: number;
  weight_pct: number;
  order_index: number;
}

export async function getRubricCriteria(track: string): Promise<DbRubricCriterion[]> {
  const { data, error } = await supabase
    .from("rubric_criteria")
    .select("*")
    .eq("track", track)
    .order("order_index");
  if (error) throw error;
  // Deduplicate by order_index in case schema was run multiple times
  const seen = new Set<number>();
  return (data ?? []).filter((row) => {
    if (seen.has(row.order_index)) return false;
    seen.add(row.order_index);
    return true;
  });
}
