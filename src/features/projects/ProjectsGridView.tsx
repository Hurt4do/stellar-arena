"use client";

import { useState } from "react";
import ProjectSummaryCard from "@/components/dashboard/ProjectSummaryCard";
import type { Project } from "@/types/dashboard";
import { CheckCircle2, AlertCircle } from "lucide-react";

type TrackFilter = "all" | "genesis" | "scale";

export default function ProjectsGridView({
  projects,
  scoredProjectIds,
  evalCounts = {},
  errorMessage,
  defaultTrack,
}: {
  projects: Project[];
  scoredProjectIds: string[];
  evalCounts?: Record<string, number>;
  errorMessage?: string;
  defaultTrack?: "genesis" | "scale" | null;
}) {
  const [filter, setFilter] = useState<TrackFilter>(defaultTrack ?? "all");

  const filtered = projects.filter((p) => {
    if (filter === "all") return true;
    const t = (p.track ?? "").toLowerCase();
    return t === filter;
  });

  const genesisCount = projects.filter((p) => (p.track ?? "").toLowerCase() === "genesis").length;
  const scaleCount = projects.filter((p) => (p.track ?? "").toLowerCase() === "scale").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="mt-2 text-[26px] font-oxanium tracking-wider font-semibold text-black">
          All projects
        </h1>
        {!errorMessage && projects.length > 0 && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/5 self-start sm:self-auto">
            {([
              { key: "all" as const, label: "ALL", count: projects.length },
              { key: "genesis" as const, label: "GENESIS", count: genesisCount },
              { key: "scale" as const, label: "SCALE", count: scaleCount },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[9px] font-oxanium tracking-widest font-semibold uppercase transition-all"
                style={{
                  background: filter === key ? "#00B3D4" : "transparent",
                  color: filter === key ? "#fff" : "rgba(0,0,0,0.45)",
                  boxShadow: filter === key ? "0 0 10px rgba(0,179,212,0.3)" : "none",
                }}
              >
                {label}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[8px]"
                  style={{
                    background: filter === key ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)",
                    color: filter === key ? "#fff" : "rgba(0,0,0,0.4)",
                  }}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-oxanium tracking-wider font-semibold text-red-700">
              Failed to load projects
            </div>
            <div className="mt-1 text-[11px] font-oxanium tracking-wider text-red-500 break-all">
              {errorMessage}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 && projects.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            No projects yet. Upload a DoraHacks CSV from{" "}
            <span className="text-neon-cyan">Import CSV</span> to get started.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            No {filter} track projects found.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-visible">
          {filtered.map((p, idx) => (
            <div key={p.id} className="relative flex flex-col">
              {(evalCounts[p.id] ?? 0) > 0 && (
                <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 rounded-full bg-neon-cyan px-2 py-0.5 shadow-[0_0_10px_rgba(0,179,212,0.4)]">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                  <span className="text-[8px] font-oxanium tracking-widest text-white font-semibold">
                    {evalCounts[p.id]} EVAL{evalCounts[p.id] !== 1 ? "S" : ""}
                  </span>
                </div>
              )}
              <ProjectSummaryCard
                project={p}
                href={`/projects/${p.id}`}
                tone={idx % 2 === 0 ? "cyan" : "purple"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
