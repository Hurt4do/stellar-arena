import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RankingRow } from "@/types/dashboard";

function scoreBarWidth(score: number) {
  // Design uses a "near-full" look; map 0..10 to 10..100 to avoid empty bars.
  return `${Math.min(100, Math.max(10, (score / 10) * 100))}%`;
}

export default function LeaderboardRow({
  row,
  highlightTone = "cyan",
  onViewDetails,
}: {
  row: RankingRow;
  highlightTone?: "cyan" | "purple";
  onViewDetails?: () => void;
}) {
  const efficiencyFill =
    highlightTone === "cyan"
      ? "bg-neon-cyan shadow-[0_0_22px_rgba(0,179,212,0.20)]"
      : "bg-neon-purple shadow-[0_0_22px_rgba(179,92,255,0.25)]";
  const innovationFill =
    highlightTone === "cyan"
      ? "bg-neon-purple shadow-[0_0_22px_rgba(179,92,255,0.25)]"
      : "bg-neon-cyan shadow-[0_0_22px_rgba(0,179,212,0.20)]";

  return (
    <div className="rounded-xl border border-black/10 bg-white px-5 py-4 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 min-w-[280px]">
        <div className="w-[44px] h-[44px] rounded-xl border border-black/10 bg-white flex items-center justify-center">
          <div className="text-[14px] font-oxanium tracking-widest font-semibold text-black/85">
            {row.rank.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-neon-cyan" />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-oxanium tracking-widest font-semibold text-black">
            {row.projectName}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {row.metadataTags.map((t) => (
              <Badge key={t} variant="gray" className="px-2 py-1 rounded-full text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="w-[90px]">
          <div className="text-[11px] tracking-widest uppercase text-black/50 font-oxanium">
            Efficiency
          </div>
          <div className="text-[13px] font-oxanium tracking-widest font-semibold text-black mt-2 flex items-center gap-2">
            <span className={cn("text-black")}>{row.efficiency.toFixed(1)}</span>
          </div>
          <div className="mt-2 h-[6px] rounded-full bg-black/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full", efficiencyFill)}
              style={{ width: scoreBarWidth(row.efficiency) }}
            />
          </div>
        </div>

        <div className="w-[90px]">
          <div className="text-[11px] tracking-widest uppercase text-black/50 font-oxanium">
            Innovation
          </div>
          <div className="text-[13px] font-oxanium tracking-widest font-semibold text-black mt-2">
            {row.innovation.toFixed(1)}
          </div>
          <div className="mt-2 h-[6px] rounded-full bg-black/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full", innovationFill)}
              style={{ width: scoreBarWidth(row.innovation) }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="text-right">
          <div className="text-[11px] tracking-widest uppercase font-oxanium text-black/50">
            Total Score
          </div>
          <div className="mt-2 text-[18px] font-oxanium tracking-widest font-semibold text-black">
            {row.totalScore.toFixed(1)}
          </div>
        </div>

        <Button
          variant="ghost"
          className="rounded-xl border border-black/10 px-4"
          onClick={onViewDetails}
        >
          <ArrowUpRight className="h-4 w-4" />
          VIEW DETAILS
        </Button>
      </div>
    </div>
  );
}

