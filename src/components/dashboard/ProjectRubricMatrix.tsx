"use client";

import type { ScoreRubricFactor } from "@/types/dashboard";
import { cn } from "@/lib/utils";

function toneClasses(tone: ScoreRubricFactor["tone"]) {
  switch (tone) {
    case "purple":
      return { text: "glow-purple", dot: "bg-neon-purple shadow-[0_0_18px_rgba(179,92,255,0.35)]" };
    case "green":
      return {
        text: "text-emerald-300",
        dot: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)]",
      };
    case "cyan":
      return { text: "glow-cyan", dot: "bg-neon-cyan shadow-[0_0_18px_rgba(0,179,212,0.28)]" };
    case "blue":
      return { text: "glow-cyan", dot: "bg-neon-cyan shadow-[0_0_18px_rgba(0,179,212,0.28)]" };
    default:
      return { text: "", dot: "bg-neon-cyan" };
  }
}

export default function ProjectRubricMatrix({
  title,
  factors,
}: {
  title: string;
  factors: ScoreRubricFactor[];
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white px-6 py-5">
      <div className="text-[12px] tracking-widest font-oxanium font-semibold text-black/70">
        {title}
      </div>
      <div className="mt-4 space-y-6">
        {factors.map((factor) => {
          const tone = toneClasses(factor.tone);
          const dotLeftPct = `${Math.max(2, Math.min(98, (factor.score / 10) * 100))}%`;

          return (
            <div key={factor.key}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13px] font-oxanium tracking-wider text-black font-semibold">
                    {factor.title}
                  </div>
                  <div className="text-[11px] text-black/45 mt-1 leading-snug">
                    {factor.description}
                  </div>
                </div>
                <div className={cn("text-[22px] font-oxanium tracking-widest font-semibold", tone.text)}>
                  {factor.score.toString().padStart(2, "0")}
                </div>
              </div>

              <div className="mt-4 relative h-[2px] bg-black/10 rounded-full overflow-visible">
                <div
                  className={cn(
                    "absolute -top-[9px] -translate-x-1/2 w-[14px] h-[14px] rounded-full",
                    tone.dot,
                  )}
                  style={{ left: dotLeftPct }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

