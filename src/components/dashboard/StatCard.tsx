import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  tone = "cyan",
  rightIcon,
}: {
  label: string;
  value: string;
  tone?: "cyan" | "purple";
  rightIcon?: ReactNode;
}) {
  const borderClass =
    tone === "cyan"
      ? "neon-border-cyan"
      : "neon-border-purple";

  return (
    <div className={cn("rounded-xl border bg-white px-6 py-5 flex items-center justify-between", borderClass)}>
      <div>
        <div className="text-[11px] font-oxanium tracking-widest text-black/55">
          {label}
        </div>
        <div className={cn("text-black font-oxanium tracking-widest font-semibold mt-2 text-3xl")}>
          {value}
        </div>
      </div>
      {rightIcon ? <div className="text-black/70">{rightIcon}</div> : null}
    </div>
  );
}

