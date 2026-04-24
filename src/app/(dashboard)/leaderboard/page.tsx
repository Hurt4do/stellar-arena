export const dynamic = "force-dynamic";

import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { getProjects } from "@/lib/db/projects";
import { getLeaderboardScores, getProjectEvalCounts } from "@/lib/db/scores";
import type { RankingRow } from "@/types/dashboard";

export default async function LeaderboardPage() {
  let rows: RankingRow[] = [];

  try {
    const [projects, leaderboardScores, evalCounts] = await Promise.all([
      getProjects(),
      getLeaderboardScores().catch(() => []),
      getProjectEvalCounts(),
    ]);

    const projectMap: Record<string, string> = {};
    const trackMap: Record<string, string> = {};
    for (const p of projects) {
      projectMap[p.id] = p.name;
      trackMap[p.id] = p.track ?? "Unknown";
    }

    // Build avg score map and judge_count from leaderboard scores (from scores table)
    const avgMap: Record<string, number> = {};
    const judgeCountMap: Record<string, number> = {};
    for (const s of leaderboardScores) {
      avgMap[s.project_id] = s.avg_score;
      judgeCountMap[s.project_id] = s.judge_count;
    }

    // Only rank projects that have actual scored evaluations (avg_score from scores table).
    // Projects with only project_feedback (no per-criterion scores) would show as 0 and
    // corrupt the global average.
    const evaluatedIds = Object.keys(avgMap);

    rows = evaluatedIds
      .map((id) => ({
        rank: 0,
        projectId: id,
        projectName: projectMap[id] ?? id,
        metadataTags: [
          trackMap[id] ?? "Unknown",
          `${evalCounts[id]} eval${evalCounts[id] !== 1 ? "s" : ""}`,
        ],
        efficiency: avgMap[id] ?? 0,
        innovation: avgMap[id] ?? 0,
        totalScore: avgMap[id] ?? 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore || a.projectName.localeCompare(b.projectName))
      .map((row, i) => ({ ...row, rank: i + 1 }));
  } catch {
    // Supabase not configured — show empty state
  }

  return <LeaderboardView initialRows={rows} scoredCount={rows.length} />;
}
