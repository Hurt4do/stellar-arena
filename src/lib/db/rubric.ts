import { supabase } from "@/lib/supabase";

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
  return data ?? [];
}
