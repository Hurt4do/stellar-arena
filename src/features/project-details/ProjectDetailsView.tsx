"use client";

import { useEffect, useMemo, useState } from "react";
import projects from "@/mock-data/projects.json";
import scoreStates from "@/mock-data/scoreStates.json";
import type { Project, ProjectScoreState, ScoreRubricFactor } from "@/types/dashboard";
import ProjectRubricMatrix from "@/components/dashboard/ProjectRubricMatrix";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ProjectDetailsView({
  projectId,
}: {
  projectId: string;
}) {
  const project = useMemo(
    () => (projects as Project[]).find((p) => p.id === projectId),
    [projectId],
  );

  const scoreState = useMemo(
    () => (scoreStates as ProjectScoreState[]).find((s) => s.projectId === projectId),
    [projectId],
  );

  const [log, setLog] = useState(scoreState?.judgeLog ?? "");

  useEffect(() => {
    if (scoreState?.judgeLog) setLog(scoreState.judgeLog);
  }, [scoreState]);

  if (!project || !scoreState) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-black/70">
        Project scoring state not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              {project.projectIdLabel ? (
                <div className="inline-flex items-center rounded-full border border-neon-purple/20 bg-neon-purple/10 px-4 py-1 text-[11px] font-oxanium tracking-widest font-semibold text-neon-purple">
                  {project.projectIdLabel}
                </div>
              ) : null}

              <h2 className="mt-3 text-[38px] font-oxanium tracking-wide font-semibold text-black leading-none">
                {project.name}
              </h2>
              <p className="mt-3 text-[13px] font-oxanium tracking-wider text-black/55 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center w-[86px] h-[86px] rounded-2xl border border-black/10 bg-black/5">
              <div className="h-14 w-14 rounded-2xl border border-black/10 bg-white flex items-center justify-center">
                <span className="text-black/40 font-oxanium text-sm">{"</>"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white px-6 py-6 flex flex-col">
          <div className="text-[11px] font-oxanium tracking-widest text-black/45 uppercase">
            GLOBAL RANK
          </div>
          <div className="mt-2 text-[46px] font-oxanium tracking-widest font-semibold text-neon-cyan/90">
            {(project.globalRank ?? 4).toString().padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] font-oxanium tracking-wider text-black/45">
            {project.globalRankLabel ?? "Top 5% Tier"}
          </div>
        </div>
      </div>

      <ProjectRubricMatrix
        title="TECHNICAL EVALUATION MATRIX"
        factors={scoreState.rubric as ScoreRubricFactor[]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
          <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70">
            JUDGE&apos;S INTERNAL LOG
          </div>
          <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4">
            <Textarea
              value={log}
              onChange={(e) => setLog(e.target.value)}
              rows={5}
              className="border-none bg-transparent p-0"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white px-6 py-6 flex flex-col gap-4">
          <Button variant="secondary" className="rounded-xl px-8">
            SAVE DRAFT
          </Button>
          <Button
            variant="purple"
            className={cn("rounded-xl px-8", "py-3")}
          >
            SUBMIT SCORES
          </Button>
        </div>
      </div>
    </div>
  );
}

