import Link from "next/link";
import type { DbProject } from "@/lib/db/projects";
import type { DbScore } from "@/lib/db/scores";
import type { DbRubricCriterion } from "@/lib/db/rubric";
import { CheckCircle2, Clock } from "lucide-react";

type FeedbackEntry = { final_comment: string | null; pitch_tags: string[] | null; outcome: string | null };

export default function MyScoringView({
  projects,
  scoredProjectIds,
  judgeId,
  scoreMap,
  feedbackMap,
  criteria,
}: {
  projects: DbProject[];
  scoredProjectIds: Set<string>;
  judgeId: string | null;
  scoreMap: Record<string, DbScore[]>;
  feedbackMap: Record<string, FeedbackEntry>;
  criteria: DbRubricCriterion[];
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
              <ProjectCard
                key={p.id}
                project={p}
                evaluated={true}
                scores={scoreMap[p.id] ?? []}
                feedback={feedbackMap[p.id]}
                criteria={criteria}
              />
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

function ProjectCard({
  project,
  evaluated,
  scores = [],
  feedback,
  criteria = [],
}: {
  project: DbProject;
  evaluated: boolean;
  scores?: DbScore[];
  feedback?: FeedbackEntry;
  criteria?: DbRubricCriterion[];
}) {
  // Compute total score
  const maxTotal = criteria.reduce((a, c) => a + c.max_score, 0);
  const rawTotal = criteria.reduce((a, c) => a + (scores.find((s) => s.criterion_id === c.id)?.score ?? 0), 0);
  const totalPct = maxTotal > 0 ? Math.round((rawTotal / maxTotal) * 100) : 0;

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
        {evaluated && maxTotal > 0 && (
          <div className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-center">
            <div className="text-[8px] font-oxanium tracking-widest text-black/35">TOTAL EVAL</div>
            <div className="text-[14px] font-oxanium font-semibold leading-tight text-emerald-600">
              {totalPct}<span className="text-[9px] text-black/30">/100</span>
            </div>
          </div>
        )}
        {evaluated && maxTotal === 0 && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        )}
      </div>

      {project.team_description && (
        <p className="text-[11px] text-black/50 line-clamp-2 leading-relaxed">
          {project.team_description}
        </p>
      )}

      {/* Score details for evaluated projects */}
      {evaluated && criteria.length > 0 && scores.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-2">
          {/* Per-criterion rows */}
          <div className="space-y-1">
            {criteria.map((c) => {
              const s = scores.find((sc) => sc.criterion_id === c.id);
              const score = s?.score ?? 0;
              return (
                <div key={c.id} className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-oxanium tracking-widest text-black/45 truncate flex-1">
                    {c.pillar_name}
                  </span>
                  <span className="text-[10px] font-oxanium font-semibold text-black/65 shrink-0">
                    {score}<span className="text-black/30">/{c.max_score}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Final comment */}
          {feedback?.final_comment && (
            <div className="pt-1 border-t border-black/5">
              <div className="text-[9px] font-oxanium tracking-widest text-black/35 mb-0.5">OBSERVATIONS</div>
              <p className="text-[10px] font-oxanium tracking-wider text-black/55 line-clamp-3 leading-relaxed">
                {feedback.final_comment}
              </p>
            </div>
          )}

          {/* Pitch tags */}
          {feedback?.pitch_tags && feedback.pitch_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1 border-t border-black/5">
              {feedback.pitch_tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neon-cyan/10 px-2 py-0.5 text-[8px] font-oxanium tracking-widest text-neon-cyan font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Scale outcome */}
          {feedback?.outcome && (
            <div className="pt-1 border-t border-black/5">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[8px] font-oxanium tracking-widest font-semibold"
                style={{
                  background: feedback.outcome === "INSTAWARD" ? "rgba(0,179,212,0.1)" : feedback.outcome === "SCF_BUILD" ? "rgba(179,92,255,0.1)" : "rgba(0,0,0,0.06)",
                  color: feedback.outcome === "INSTAWARD" ? "#00B3D4" : feedback.outcome === "SCF_BUILD" ? "#B35CFF" : "rgba(0,0,0,0.5)",
                }}
              >
                {feedback.outcome.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
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
