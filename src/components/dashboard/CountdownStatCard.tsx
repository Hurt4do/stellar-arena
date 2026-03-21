"use client";

import { useMemo } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

export default function CountdownStatCard({
  label,
  initialSeconds,
  tone = "cyan",
}: {
  label: string;
  initialSeconds: number;
  tone?: "cyan" | "purple";
}) {
  const { label: formatted, secondsLeft } = useCountdown(initialSeconds);

  // Remaining time drives the underline progress.
  const progressPct = useMemo(
    () =>
      Math.max(
        0,
        Math.min(100, (secondsLeft / initialSeconds) * 100),
      ),
    [secondsLeft, initialSeconds],
  );

  const borderClass = tone === "cyan" ? "neon-border-cyan" : "neon-border-purple";
  const barFill = tone === "cyan" ? "bg-neon-cyan" : "bg-neon-purple";

  return (
    <div className={cn("rounded-xl border bg-white px-6 py-5", borderClass)}>
      <div className="text-[11px] font-oxanium tracking-widest uppercase text-black/55">
        {label}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-[40px] leading-none font-oxanium tracking-wider font-semibold text-black">
          {formatted}
        </div>
        <div className="pb-2 text-[11px] font-oxanium tracking-widest uppercase text-black/45">
          HRS
        </div>
      </div>
      <div className="mt-4 h-[4px] rounded-full bg-black/10 overflow-hidden">
        <div className={cn("h-full", barFill)} style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}

