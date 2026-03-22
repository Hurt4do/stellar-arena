import { supabase } from "@/lib/supabase";

export interface DbProject {
  id: string;
  name: string;
  profile_url: string | null;
  demo_link: string | null;
  github: string | null;
  track: string | null;
  bounties: string | null;
  team_members: string | null;
  team_description: string | null;
  review_status: string | null;
  submission_time: string | null;
  last_updated: string | null;
  created_at: string;
}

export async function getProjects(): Promise<DbProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<DbProject | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAllProjects(): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .neq("id", "");  // matches all rows
  if (error) throw error;
}

export async function upsertProjects(rows: Omit<DbProject, "created_at">[]): Promise<{ inserted: number; updated: number }> {
  const { data, error } = await supabase
    .from("projects")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: false })
    .select("id");
  if (error) throw error;
  return { inserted: data?.length ?? 0, updated: 0 };
}
