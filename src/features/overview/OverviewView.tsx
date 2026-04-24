import { Button } from "@/components/ui/button";
import ProjectQueueCard from "@/components/dashboard/ProjectQueueCard";
import StatCard from "@/components/dashboard/StatCard";
import CountdownStatCard from "@/components/dashboard/CountdownStatCard";
import { getProjects, normalizeTrack } from "@/lib/db/projects";
import { getProjectEvalCounts } from "@/lib/db/scores";
import type { QueueItem } from "@/types/dashboard";

export default async function OverviewView({
  currentTrack,
}: {
  currentTrack: "genesis" | "scale" | null;
}) {
  let totalProjects = 0;
  let queue: QueueItem[] = [];

  try {
    const [projects, evalCountMap] = await Promise.all([
      getProjects(),
      getProjectEvalCounts(),
    ]);

    // Normalize tracks and filter by the judge's current track
    const filtered = projects
      .map((p) => ({ ...p, track: normalizeTrack(p.track) ?? p.track }))
      .filter((p) => {
        if (!currentTrack) return true;
        const t = (p.track ?? "").toLowerCase();
        return t === currentTrack;
      });

    totalProjects = filtered.length;

    queue = filtered.map((p) => {
      const count = evalCountMap[p.id] ?? 0;
      return {
        id: p.id,
        projectId: p.id,
        teamName: p.name,
        status: count > 0 ? "evaluated" : "pending",
        statusLabel: count > 0 ? "EVALUATED" : "PENDING",
        stackTags: p.track ? [p.track] : [],
        evaluationProgressPct: count > 0 ? 100 : 0,
        actionLabel: "EVALUATE",
        evalCount: count,
      };
    });
  } catch {
    // Supabase not yet configured — fall through with empty state
  }

  const pendingCount = queue.filter((q) => q.status === "pending").length;
  const trackLabel = currentTrack ? currentTrack.charAt(0).toUpperCase() + currentTrack.slice(1) : "All";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label={`${trackLabel.toUpperCase()} PROJECTS`} value={String(totalProjects || "—")} tone="cyan" />
        <StatCard label="PENDING EVALUATION" value={String(pendingCount || "—")} tone="purple" />
        <CountdownStatCard label="TIME LEFT (COUNTDOWN)" initialSeconds={4 * 3600 + 22 * 60 + 15} tone="cyan" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-oxanium tracking-wider font-semibold text-black">
          Active Judging Queue
          {currentTrack && (
            <span className="ml-2 text-[11px] font-oxanium tracking-widest text-neon-cyan font-semibold uppercase">
              {trackLabel} Track
            </span>
          )}
        </h2>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            {currentTrack
              ? `No ${trackLabel} track projects yet. Upload a DoraHacks CSV from `
              : "No projects yet. Upload a DoraHacks CSV from "}
            <span className="text-neon-cyan">Import CSV</span> to get started.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {queue.map((item) => (
            <ProjectQueueCard
              key={item.id}
              item={item}
              primaryActionHref={`/evaluation/${item.projectId}`}
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
