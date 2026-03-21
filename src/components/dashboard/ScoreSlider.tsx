"use client";

import { Slider } from "@/components/ui/slider";

export default function ScoreSlider({
  label,
  valuePct,
  tone = "cyan",
  onChange,
}: {
  label: string;
  valuePct: number;
  tone?: "cyan" | "purple";
  onChange: (next: number) => void;
}) {
  const colorClass = tone === "cyan" ? "text-neon-cyan" : "text-neon-purple";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-oxanium tracking-widest uppercase text-black/55">
          {label}
        </div>
        <div className={`text-[11px] font-oxanium tracking-widest uppercase ${colorClass}`}>
          {valuePct}%
        </div>
      </div>
      <div className="px-1">
        <Slider
          tone={tone}
          min={0}
          max={100}
          step={1}
          value={[valuePct]}
          onValueChange={(v) => onChange(v[0] ?? valuePct)}
        />
      </div>
    </div>
  );
}

