import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DbProject } from "@/lib/db/projects";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectSummaryView({ project }: { project: DbProject | null }) {
  if (!project) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-black/70 font-oxanium tracking-widest">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <Link
          href="/projects"
          className="text-[12px] font-oxanium tracking-widest text-black/45 hover:text-black transition-colors"
        >
          ← RETURN TO GRID
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          {project.github && (
            <Button asChild variant="secondary" className="rounded-xl px-6">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" /> GITHUB
              </a>
            </Button>
          )}
          {project.demo_link && (
            <Button asChild variant="secondary" className="rounded-xl px-6">
              <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> LIVE DEMO
              </a>
            </Button>
          )}
          {project.profile_url && (
            <Button asChild variant="secondary" className="rounded-xl px-6">
              <a href={project.profile_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> DORAHACKS
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Title + track badge */}
      <div className="pt-2">
        {project.track && (
          <span className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 px-3 py-1 border border-neon-cyan/20 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
            <span className="text-[10px] font-oxanium tracking-widest text-neon-cyan">
              {project.track.toUpperCase()} TRACK
            </span>
          </span>
        )}
        <h1 className="mt-2 text-[42px] sm:text-[54px] leading-[1.02] font-oxanium tracking-wide font-semibold text-black">
          <span className="relative inline-block">
            {project.name}
            <span className="absolute -bottom-1 left-0 right-0 h-[4px] bg-neon-cyan/90 shadow-[0_0_30px_rgba(0,179,212,0.36)] rounded-full" />
          </span>
        </h1>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Left: description */}
        <div className="rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.02))] px-6 py-6">
          <div className="text-[12px] tracking-widest font-oxanium font-semibold text-black/70">
            <span className="text-neon-cyan">—</span> PROJECT DESCRIPTION
          </div>
          {project.team_description ? (
            <p className="mt-4 text-[13px] font-oxanium tracking-wider text-black/55 leading-relaxed">
              {project.team_description}
            </p>
          ) : (
            <p className="mt-4 text-[13px] font-oxanium tracking-wider text-black/30 leading-relaxed italic">
              No description provided.
            </p>
          )}

          {/* Extra metadata */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.bounties && (
              <div>
                <div className="text-[9px] font-oxanium tracking-widest text-black/40 mb-1">BOUNTIES</div>
                <div className="text-[12px] font-oxanium tracking-wider text-black/70">{project.bounties}</div>
              </div>
            )}
            {project.submission_time && (
              <div>
                <div className="text-[9px] font-oxanium tracking-widest text-black/40 mb-1">SUBMITTED</div>
                <div className="text-[12px] font-oxanium tracking-wider text-black/70">{project.submission_time}</div>
              </div>
            )}
            {project.review_status && (
              <div>
                <div className="text-[9px] font-oxanium tracking-widest text-black/40 mb-1">REVIEW STATUS</div>
                <div className="text-[12px] font-oxanium tracking-wider text-black/70">{project.review_status}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Evaluate button */}
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[14px] font-oxanium tracking-widest font-semibold text-black text-center">
              JUDGING_PROTOCOL
            </div>
            <div className="mt-2 text-[12px] font-oxanium tracking-wider text-black/55 text-center">
              Initiate the multi-factor scoring rubric for this entry.
            </div>
            <div className="mt-5 flex justify-center">
              <Button asChild variant="default" className="rounded-xl px-10">
                <Link href={`/evaluation/${project.id}`}>START EVALUATION</Link>
              </Button>
            </div>
          </div>

          {/* Team members */}
          {project.team_members && (
            <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
              <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70 mb-4">
                THE TEAM
              </div>
              <div className="space-y-2">
                {project.team_members.split(/[,\n]/).map((member) => member.trim()).filter(Boolean).map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-oxanium font-semibold text-neon-cyan">
                        {member.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[12px] font-oxanium tracking-wider text-black/70 truncate">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
