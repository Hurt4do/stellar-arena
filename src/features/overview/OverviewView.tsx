import { Button } from "@/components/ui/button";
import ProjectQueueCard from "@/components/dashboard/ProjectQueueCard";
import StatCard from "@/components/dashboard/StatCard";
import CountdownStatCard from "@/components/dashboard/CountdownStatCard";
import { getProjects } from "@/lib/db/projects";
import { getLeaderboardScores } from "@/lib/db/scores";
import type { QueueItem } from "@/types/dashboard";

export default async function OverviewView() {
  let totalProjects = 0;
  let scoredProjects = 0;
  let queue: QueueItem[] = [];

  try {
    const [projects, leaderboardScores] = await Promise.all([
      getProjects(),
      getLeaderboardScores(),
    ]);

    totalProjects = projects.length;
    const scoredIds = new Set(leaderboardScores.map((s) => s.project_id));
    scoredProjects = scoredIds.size;

    queue = projects.map((p) => ({
      id: p.id,
      projectId: p.id,
      teamName: p.name,
      status: scoredIds.has(p.id) ? "evaluated" : "pending",
      statusLabel: scoredIds.has(p.id) ? "EVALUATED" : "PENDING",
      stackTags: p.track ? [p.track] : [],
      evaluationProgressPct: scoredIds.has(p.id) ? 100 : 0,
      actionLabel: scoredIds.has(p.id) ? "VIEW PROJECT" : "EVALUATE",
    }));
  } catch {
    // Supabase not yet configured — fall through with empty state
  }

  const pendingCount = queue.filter((q) => q.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="TOTAL PROJECTS" value={String(totalProjects || "—")} tone="cyan" />
        <StatCard label="PENDING EVALUATION" value={String(pendingCount || "—")} tone="purple" />
        <CountdownStatCard label="TIME LEFT (COUNTDOWN)" initialSeconds={4 * 3600 + 22 * 60 + 15} tone="cyan" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-oxanium tracking-wider font-semibold text-black">
          Active Judging Queue
        </h2>
        <div className="flex items-center gap-4 text-[12px] font-oxanium tracking-widest font-semibold text-black/45">
          <span>Filter: Newest</span>
          <span className="h-5 w-px bg-black/10" />
          <span>View: Grid</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            No projects yet. Upload a DoraHacks CSV from{" "}
            <span className="text-neon-cyan">Import CSV</span> to get started.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {queue.map((item) => (
            <ProjectQueueCard
              key={item.id}
              item={{ ...item, actionLabel: item.status === "evaluated" ? "VIEW PROJECT" : "EVALUATE" }}
              primaryActionHref={
                item.status === "evaluated"
                  ? `/projects/${item.projectId}`
                  : `/evaluation/${item.projectId}`
              }
            />
          ))}
        </div>
      )}

      <div className="pt-3">
        <Button variant="default" className="rounded-xl px-8">
          FINALIZE_SCORES
        </Button>
      </div>
    </div>
  );
}
