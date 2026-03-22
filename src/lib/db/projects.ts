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
  // Extended CSV fields
  countries: string | null;
  scf_track_choice: string | null;
  budget_usd: string | null;
  score_overall: string | null;
  score_narrative: string | null;
  score_technical: string | null;
  score_feasibility: string | null;
  score_traction: string | null;
  website: string | null;
  twitter: string | null;
  video_pitch: string | null;
  pitch_deck: string | null;
  docs_url: string | null;
  architecture_url: string | null;
  problem: string | null;
  solution: string | null;
  key_integrations: string | null;
  reviewer_feedback: string | null;
  created_at: string;
}

/** Normalize DoraHacks track names like "Track 2: Stellar Genesis" → "Genesis" */
export function normalizeTrack(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("genesis")) return "Genesis";
  if (lower.includes("scale")) return "Scale";
  return raw;
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
