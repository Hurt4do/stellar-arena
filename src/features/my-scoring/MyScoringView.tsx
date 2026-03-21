import queue from "@/mock-data/queue.json";
import ProjectQueueCard from "@/components/dashboard/ProjectQueueCard";
import type { QueueItem } from "@/types/dashboard";

export default function MyScoringView() {
  const items = queue as QueueItem[];
  const myItems = items.filter((i) => i.status !== "evaluated" || i.evaluationProgressPct === 100);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-[26px] font-oxanium tracking-wider font-semibold text-black">
          MY_SCORING
        </h1>
        <div className="text-[12px] font-oxanium tracking-widest text-black/45">
          Editing and submitting your current evaluations.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myItems.map((item) => (
          <ProjectQueueCard key={item.id} item={item} primaryActionHref={`/projects/${item.projectId}`} />
        ))}
      </div>
    </div>
  );
}

