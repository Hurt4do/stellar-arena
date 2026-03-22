export const dynamic = "force-dynamic";

import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { getProjects } from "@/lib/db/projects";
import { getLeaderboardScores } from "@/lib/db/scores";
import type { RankingRow } from "@/types/dashboard";

export default async function LeaderboardPage() {
  let rows: RankingRow[] = [];

  try {
    const [projects, leaderboardScores] = await Promise.all([
      getProjects(),
      getLeaderboardScores(),
    ]);

    const projectMap: Record<string, string> = {};
    const trackMap: Record<string, string> = {};
    for (const p of projects) {
      projectMap[p.id] = p.name;
      trackMap[p.id] = p.track ?? "Unknown";
    }

    rows = leaderboardScores
      .sort((a, b) => b.avg_score - a.avg_score)
      .map((s, i) => ({
        rank: i + 1,
        projectId: s.project_id,
        projectName: projectMap[s.project_id] ?? s.project_id,
        metadataTags: [trackMap[s.project_id] ?? "Unknown", `${s.judge_count} judge${s.judge_count !== 1 ? "s" : ""}`],
        efficiency: s.avg_score,
        innovation: s.avg_score,
        totalScore: s.avg_score,
      }));
  } catch {
    // Supabase not configured — show empty state
  }

  return <LeaderboardView initialRows={rows} scoredCount={rows.length} />;
}
