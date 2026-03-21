"use client";

import { useMemo, useState } from "react";
import LeaderboardRow from "@/components/dashboard/LeaderboardRow";
import ScoreSlider from "@/components/dashboard/ScoreSlider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { RankingRow } from "@/types/dashboard";
import Image from "next/image";
import logo from "@/app/public/BAF1.png";

export default function LeaderboardView({
  initialRows,
  scoredCount,
}: {
  initialRows: RankingRow[];
  scoredCount: number;
}) {
  const [effW, setEffW] = useState(50);
  const innovationW = useMemo(() => 100 - effW, [effW]);

  const rows = useMemo(() => {
    if (initialRows.length === 0) return [];
    // Re-rank based on slider weights (visual exploration only)
    return [...initialRows]
      .map((row) => ({
        ...row,
        totalScore:
          Math.round(
            (row.efficiency * (effW / 100) + row.innovation * (innovationW / 100)) * 10,
          ) / 10,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((row, i) => ({ ...row, rank: i + 1 }));
  }, [initialRows, effW, innovationW]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[13px] font-oxanium tracking-widest text-neon-cyan/90 font-semibold">
            <span className="sr-only">JUDGE_PORTAL</span>
            <Image
              src={logo}
              alt="Judge Portal logo"
              width={26}
              height={26}
              className="inline-block align-middle"
            />
            <span className="text-black/35 ml-2 text-[11px] tracking-wider">
              BAF JUDGING
            </span>
          </div>
          <h1 className="mt-2 text-[36px] font-oxanium tracking-wide font-semibold text-black">
            LIVE_RANKINGS
          </h1>
          <p className="mt-2 text-[13px] font-oxanium tracking-wider text-black/55 max-w-[520px]">
            Real-time breakdown of project performance based on submitted judge scores.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="rounded-xl border border-black/10 bg-white px-6 py-4">
            <div className="text-[10px] tracking-widest font-oxanium text-black/50 uppercase">
              PROJECTS SCORED
            </div>
            <div className="text-[20px] font-oxanium tracking-widest font-semibold text-black mt-1">
              {scoredCount}
            </div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white px-6 py-4">
            <div className="text-[10px] tracking-widest font-oxanium text-black/50 uppercase">
              GLOBAL AVG
            </div>
            <div className="text-[20px] font-oxanium tracking-widest font-semibold text-black mt-1">
              {rows.length > 0
                ? (rows.reduce((a, b) => a + b.totalScore, 0) / rows.length).toFixed(1)
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            No scores yet. Start evaluating projects to see rankings here.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <LeaderboardRow
              key={row.projectId}
              row={row}
              highlightTone={row.rank % 2 === 0 ? "purple" : "cyan"}
            />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.02))] p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl border border-black/10 bg-white flex items-center justify-center">
                <span className="text-neon-cyan font-oxanium">⌁</span>
              </div>
              <div>
                <div className="text-[16px] font-oxanium tracking-widest font-semibold text-black">
                  QUICK ADJUSTMENT
                </div>
                <p className="mt-2 text-[12px] font-oxanium tracking-wider text-black/55 max-w-[520px]">
                  Visually explore how weighting changes affect rankings. Scores in Supabase are not modified.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <ScoreSlider label="WEIGHT A" valuePct={effW} tone="cyan" onChange={setEffW} />
                </div>
                <div className="space-y-4">
                  <ScoreSlider
                    label="WEIGHT B"
                    valuePct={innovationW}
                    tone="purple"
                    onChange={(v) => setEffW(100 - v)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex flex-col items-end gap-3">
            <Button variant="secondary" className="rounded-xl px-8">
              RECALCULATE
            </Button>
            <Button
              variant="outline"
              className="rounded-xl px-8 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
            >
              EXPORT CSV
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex xl:hidden items-center justify-end gap-3">
          <Button variant="secondary" className="rounded-xl px-6">
            RECALCULATE
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-6 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10"
          >
            EXPORT CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
