import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DbProject } from "@/lib/db/projects";
import { ExternalLink, Github, Globe, Twitter, Video, FileText, BookOpen, Layers } from "lucide-react";

function MetaField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[9px] font-oxanium tracking-widest text-black/40 mb-1">{label}</div>
      <div className="text-[12px] font-oxanium tracking-wider text-black/70">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.02))] px-6 py-6">
      <div className="text-[12px] tracking-widest font-oxanium font-semibold text-black/70 mb-4">
        <span className="text-neon-cyan">—</span> {title}
      </div>
      {children}
    </div>
  );
}

export default function ProjectSummaryView({ project }: { project: DbProject | null }) {
  if (!project) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-8 text-black/70 font-oxanium tracking-widest">
        Project not found.
      </div>
    );
  }

  const hasScores = project.score_overall || project.score_narrative || project.score_technical || project.score_feasibility || project.score_traction;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <Link href="/projects" className="text-[12px] font-oxanium tracking-widest text-black/45 hover:text-black transition-colors">
          ← RETURN TO GRID
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          {project.github && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5 mr-1.5" /> GITHUB
              </a>
            </Button>
          )}
          {project.demo_link && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> DEMO
              </a>
            </Button>
          )}
          {project.profile_url && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.profile_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> HACK PAGE
              </a>
            </Button>
          )}
          {project.website && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3.5 w-3.5 mr-1.5" /> WEBSITE
              </a>
            </Button>
          )}
          {project.twitter && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-3.5 w-3.5 mr-1.5" /> TWITTER
              </a>
            </Button>
          )}
          {project.video_pitch && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.video_pitch} target="_blank" rel="noopener noreferrer">
                <Video className="h-3.5 w-3.5 mr-1.5" /> VIDEO
              </a>
            </Button>
          )}
          {project.pitch_deck && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.pitch_deck} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3.5 w-3.5 mr-1.5" /> DECK
              </a>
            </Button>
          )}
          {project.docs_url && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.docs_url} target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" /> DOCS
              </a>
            </Button>
          )}
          {project.architecture_url && (
            <Button asChild variant="secondary" className="rounded-xl px-4 h-9 text-[11px]">
              <a href={project.architecture_url} target="_blank" rel="noopener noreferrer">
                <Layers className="h-3.5 w-3.5 mr-1.5" /> ARCHITECTURE
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
            <span className="text-[10px] font-oxanium tracking-widest text-neon-cyan">{project.track.toUpperCase()} TRACK</span>
          </span>
        )}
        <h1 className="mt-2 text-[38px] sm:text-[50px] leading-[1.02] font-oxanium tracking-wide font-semibold text-black">
          <span className="relative inline-block">
            {project.name}
            <span className="absolute -bottom-1 left-0 right-0 h-[4px] bg-neon-cyan/90 shadow-[0_0_30px_rgba(0,179,212,0.36)] rounded-full" />
          </span>
        </h1>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Left: content sections */}
        <div className="space-y-4">
          {project.problem && (
            <Section title="PROBLEM">
              <p className="text-[13px] font-oxanium tracking-wider text-black/60 leading-relaxed">{project.problem}</p>
            </Section>
          )}
          {project.solution && (
            <Section title="SOLUTION">
              <p className="text-[13px] font-oxanium tracking-wider text-black/60 leading-relaxed">{project.solution}</p>
            </Section>
          )}
          {project.key_integrations && (
            <Section title="KEY INTEGRATIONS">
              <p className="text-[13px] font-oxanium tracking-wider text-black/60 leading-relaxed">{project.key_integrations}</p>
            </Section>
          )}
          {project.team_description && (
            <Section title="TEAM DESCRIPTION">
              <p className="text-[13px] font-oxanium tracking-wider text-black/60 leading-relaxed">{project.team_description}</p>
            </Section>
          )}
          {project.reviewer_feedback && (
            <Section title="REVIEWER FEEDBACK">
              <p className="text-[13px] font-oxanium tracking-wider text-black/60 leading-relaxed">{project.reviewer_feedback}</p>
            </Section>
          )}
          {/* Metadata grid */}
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[12px] tracking-widest font-oxanium font-semibold text-black/70 mb-4">
              <span className="text-neon-cyan">—</span> PROJECT INFO
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <MetaField label="COUNTRIES" value={project.countries} />
              <MetaField label="SCF TRACK" value={project.scf_track_choice} />
              <MetaField label="BUDGET (USD)" value={project.budget_usd} />
              <MetaField label="BOUNTIES" value={project.bounties} />
              <MetaField label="REVIEW STATUS" value={project.review_status} />
              <MetaField label="SUBMITTED" value={project.submission_time} />
              <MetaField label="LAST UPDATED" value={project.last_updated} />
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4">
          {/* Evaluate button */}
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
            <div className="text-[14px] font-oxanium tracking-widest font-semibold text-black text-center">JUDGING_PROTOCOL</div>
            <div className="mt-2 text-[12px] font-oxanium tracking-wider text-black/55 text-center">
              Initiate the multi-factor scoring rubric for this entry.
            </div>
            <div className="mt-5 flex justify-center">
              <Button asChild variant="default" className="rounded-xl px-10">
                <Link href={`/evaluation/${project.id}`}>START EVALUATION</Link>
              </Button>
            </div>
          </div>

          {/* Scores */}
          {hasScores && (
            <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
              <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70 mb-4">SCF SCORES</div>
              <div className="space-y-2">
                {[
                  { label: "OVERALL", value: project.score_overall, max: "100" },
                  { label: "NARRATIVE", value: project.score_narrative, max: "25" },
                  { label: "TECHNICAL", value: project.score_technical, max: "30" },
                  { label: "FEASIBILITY", value: project.score_feasibility, max: "20" },
                  { label: "TRACTION", value: project.score_traction, max: "25" },
                ].filter(s => s.value).map(({ label, value, max }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-oxanium tracking-widest text-black/45">{label}</span>
                    <span className="text-[13px] font-oxanium font-semibold text-neon-cyan">
                      {value}<span className="text-[10px] text-black/35">/{max}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team members */}
          {project.team_members && (
            <div className="rounded-2xl border border-black/10 bg-white px-6 py-6">
              <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70 mb-4">THE TEAM</div>
              <div className="space-y-2">
                {project.team_members.split(/[,\n]/).map(m => m.trim()).filter(Boolean).map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-oxanium font-semibold text-neon-cyan">{member.slice(0, 1).toUpperCase()}</span>
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
