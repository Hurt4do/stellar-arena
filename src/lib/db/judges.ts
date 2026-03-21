import { supabase } from "@/lib/supabase";

export interface DbJudge {
  id: string;
  name: string;
  created_at: string;
}

export async function getJudges(): Promise<DbJudge[]> {
  const { data, error } = await supabase
    .from("judges")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createJudge(name: string): Promise<DbJudge> {
  const { data, error } = await supabase
    .from("judges")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}
