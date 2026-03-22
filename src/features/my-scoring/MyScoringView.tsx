import Link from "next/link";
import type { DbProject } from "@/lib/db/projects";
import { CheckCircle2, Clock } from "lucide-react";

export default function MyScoringView({
  projects,
  scoredProjectIds,
  judgeId,
}: {
  projects: DbProject[];
  scoredProjectIds: Set<string>;
  judgeId: string | null;
}) {
  const evaluated = projects.filter((p) => scoredProjectIds.has(p.id));
  const pending = projects.filter((p) => !scoredProjectIds.has(p.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-oxanium tracking-wider font-semibold text-black">
          MY_SCORING
        </h1>
        <p className="mt-1 text-[12px] font-oxanium tracking-widest text-black/45">
          {judgeId
            ? `${evaluated.length} evaluated · ${pending.length} pending`
            : "Log in as a Mentor to see your evaluations."}
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-black/40" />
            <span className="text-[11px] font-oxanium tracking-widest text-black/50 uppercase">
              Pending ({pending.length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {pending.map((p) => (
              <ProjectCard key={p.id} project={p} evaluated={false} />
            ))}
          </div>
        </section>
      )}

      {/* Evaluated */}
      {evaluated.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[11px] font-oxanium tracking-widest text-black/50 uppercase">
              Evaluated ({evaluated.length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {evaluated.map((p) => (
              <ProjectCard key={p.id} project={p} evaluated={true} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-[13px] font-oxanium tracking-widest text-black/40">
            No projects imported yet.
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, evaluated }: { project: DbProject; evaluated: boolean }) {
  return (
    <div className={[
      "rounded-xl border bg-white p-4 flex flex-col gap-3 transition-all",
      evaluated
        ? "border-emerald-200 bg-emerald-50/40"
        : "border-black/10 hover:border-[#00B3D4]/40 hover:shadow-[0_0_16px_rgba(0,179,212,0.1)]",
    ].join(" ")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-oxanium tracking-widest font-semibold text-black truncate">
            {project.name}
          </p>
          {project.track && (
            <p className="text-[10px] font-oxanium tracking-widest text-black/40 uppercase mt-0.5">
              {project.track}
            </p>
          )}
        </div>
        {evaluated && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        )}
      </div>

      {project.team_description && (
        <p className="text-[11px] text-black/50 line-clamp-2 leading-relaxed">
          {project.team_description}
        </p>
      )}

      <div className="mt-auto">
        <Link
          href={`/evaluation/${project.id}`}
          className={[
            "inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-oxanium tracking-widest font-semibold transition-colors",
            evaluated
              ? "border border-black/10 text-black/50 hover:bg-black/5"
              : "text-white",
          ].join(" ")}
          style={evaluated ? {} : { background: "#00B3D4", boxShadow: "0 0 12px rgba(0,179,212,0.25)" }}
        >
          {evaluated ? "RE-EVALUATE" : "EVALUATE"}
        </Link>
      </div>
    </div>
  );
}
