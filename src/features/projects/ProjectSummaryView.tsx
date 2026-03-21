import Link from "next/link";
import projects from "@/mock-data/projects.json";
import judges from "@/mock-data/judges.json";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/dashboard";

export default function ProjectSummaryView({ projectId }: { projectId: string }) {
  const data = projects as Project[];
  const project = data.find((p) => p.id === projectId);
  const judgeData = judges as Array<{ id: string; name: string; role: string; colorTone: "cyan" | "purple" | "green" }>;

  if (!project) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-black/70">
        Project not found.
      </div>
    );
  }

  const engineers =
    project.engineerIds?.map((id) => judgeData.find((j) => j.id === id)).filter(Boolean) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/projects"
          className="text-[12px] font-oxanium tracking-widest text-black/45 hover:text-black transition-colors"
        >
          RETURN TO GRID
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl px-6">
            {"<"}&nbsp;GITHUB
          </Button>
          <Button variant="secondary" className="rounded-xl px-6">
            LIVE_DEMO
          </Button>
          <Button variant="secondary" className="rounded-xl px-6">
            PITCH_DECK
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <div
          className="text-[11px] font-oxanium tracking-widest text-neon-purple/80 invisible"
          aria-hidden="true"
        />
        <h1 className="mt-3 text-[54px] leading-[1.02] font-oxanium tracking-wide font-semibold text-black">
          <span className="relative inline-block">
            {project.name}
            <span className="absolute -bottom-1 left-0 right-0 h-[4px] bg-neon-cyan/90 shadow-[0_0_30px_rgba(0,179,212,0.36)] rounded-full" />
          </span>
        </h1>
        <div className="mt-2 text-[13px] font-oxanium tracking-widest text-black/70 invisible" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.02))] px-6 py-6">
          <div className="text-[12px] tracking-widest font-oxanium font-semibold text-black/70">
            <span className="text-neon-cyan">—</span> EXECUTIVE SUMMARY
          </div>
          <p className="mt-4 text-[13px] font-oxanium tracking-wider text-black/55 leading-relaxed">
            {project.description}
          </p>
          <p className="mt-4 text-[13px] font-oxanium tracking-wider text-black/55 leading-relaxed">
            The project utilizes a novel consensus algorithm, &quot;Proof of Accuracy&quot;, to
            ensure that edge devices are contributing high-quality data to the global
            model without compromising privacy through local differential privacy
            implementations.
          </p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[14px] font-oxanium tracking-widest font-semibold text-black text-center">
              JUDGING_PROTOCOL
            </div>
            <div className="mt-2 text-[12px] font-oxanium tracking-wider text-black/55 text-center">
              Initiate the multi-factor scoring rubric for this entry.
            </div>
            <div className="mt-5 flex justify-center">
              <Button asChild variant="default" className="rounded-xl px-10">
                <Link href={`/evaluation/${projectId}`}>START EVALUATION</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70">
              THE ENGINEERS <span className="text-black/50">(03)</span>
            </div>
            <div className="mt-5 space-y-4">
              {engineers.slice(0, 3).map((j) => (
                <div key={j!.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center">
                      <span className="text-black/70 font-oxanium tracking-wider text-[12px]">
                        {(j!.name.split("_")[0] || j!.name).slice(0, 1)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black truncate">
                        {j!.name}
                      </div>
                      <div className="text-[11px] font-oxanium tracking-widest text-black/45 truncate">
                        {j!.role}
                      </div>
                    </div>
                  </div>
                  <div
                    className={j!.colorTone === "purple" ? "text-neon-purple" : "text-neon-cyan"}
                  >
                    [03]
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70">
              TECH STACK
            </div>
            <div className="mt-4 flex flex-wrap gap-2" />
          </div>
        </aside>
      </div>
    </div>
  );
}

