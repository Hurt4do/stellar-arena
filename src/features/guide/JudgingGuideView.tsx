"use client";

import { useState } from "react";
import TrackToggle from "@/components/guide/TrackToggle";
import TimelineBar, { type TimelineSegment } from "@/components/guide/TimelineBar";
import PillarGrid from "@/components/guide/PillarGrid";
import { type Pillar } from "@/components/guide/PillarDonut";
import ScoringMethodCard from "@/components/guide/ScoringMethodCard";
import OutcomeCard, { type Outcome } from "@/components/guide/OutcomeCard";

type Track = "genesis" | "scale";

// ── Genesis data ──────────────────────────────────────────────────────────────

const GENESIS_TIMELINE: TimelineSegment[] = [
  { label: "Pitch",   minutes: 3, color: "bg-neon-cyan",           textColor: "text-black",    legendColor: "#00B3D4" },
  { label: "Q&A",     minutes: 2, color: "bg-neon-purple",         textColor: "text-white",    legendColor: "#B35CFF" },
  { label: "Notes",   minutes: 2, color: "bg-black/20",            textColor: "text-black/70", legendColor: "rgba(0,0,0,0.2)" },
  { label: "Buffer",  minutes: 3, color: "bg-black/10",            textColor: "text-black/45", legendColor: "rgba(0,0,0,0.1)" },
];

const GENESIS_PILLARS: Pillar[] = [
  {
    name: "Problem & Relevance",
    weight: 20,
    subCriteria: ["Pain point clarity", "LATAM / Stellar relevance", "Market opportunity"],
    color: "cyan",
  },
  {
    name: "Solution & Product",
    weight: 20,
    subCriteria: ["Innovation", "Technical feasibility", "Product completeness"],
    color: "purple",
  },
  {
    name: "UX / UI",
    weight: 10,
    subCriteria: ["Interface quality", "User flow", "Design polish"],
    color: "amber",
  },
  {
    name: "Stellar & Ecosystem",
    weight: 30,
    subCriteria: ["Stellar integration depth", "Ecosystem tools used", "On-chain logic"],
    color: "cyan",
  },
  {
    name: "Technical Implementation",
    weight: 20,
    subCriteria: ["Code quality", "Architecture", "Smart contract / protocol usage"],
    color: "purple",
  },
];

// ── Scale data ────────────────────────────────────────────────────────────────

const SCALE_TIMELINE: TimelineSegment[] = [
  { label: "Pitch",    minutes: 6, color: "bg-neon-cyan",   textColor: "text-black", legendColor: "#00B3D4" },
  { label: "Q&A",      minutes: 8, color: "bg-neon-purple", textColor: "text-white", legendColor: "#B35CFF" },
  { label: "Feedback", minutes: 8, color: "bg-amber-400",   textColor: "text-black", legendColor: "#F59E0B" },
];

const SCALE_PILLARS: Pillar[] = [
  {
    name: "Execution & Progress",
    weight: 25,
    subCriteria: ["Milestones hit", "Team velocity", "Shipped features"],
    color: "cyan",
  },
  {
    name: "Product Maturity",
    weight: 20,
    subCriteria: ["Stability", "Real users", "Feedback loop"],
    color: "purple",
  },
  {
    name: "Technical Architecture",
    weight: 20,
    subCriteria: ["Scalability", "Security", "Stellar integration quality"],
    color: "cyan",
  },
  {
    name: "Funding Readiness",
    weight: 20,
    subCriteria: ["Business model", "Go-to-market", "Use of funds"],
    color: "amber",
  },
  {
    name: "Ecosystem Value",
    weight: 15,
    subCriteria: ["Stellar ecosystem contribution", "Community impact"],
    color: "purple",
  },
];

const SCALE_OUTCOMES: Outcome[] = [
  {
    label: "Instaward",
    amount: "Up to $15K",
    description: "Immediate on-the-spot recognition for exceptional execution.",
    tone: "cyan",
  },
  {
    label: "SCF Build",
    amount: "Up to $150K",
    description: "Direct referral into the Stellar Community Fund Build program.",
    tone: "purple",
  },
  {
    label: "Continue Building",
    amount: "—",
    description: "Mentorship and a clear pathway toward future funding rounds.",
    tone: "gray",
  },
];

// ── View ──────────────────────────────────────────────────────────────────────

export default function JudgingGuideView() {
  const [track, setTrack] = useState<Track>("genesis");

  const pillars      = track === "genesis" ? GENESIS_PILLARS  : SCALE_PILLARS;
  const segments     = track === "genesis" ? GENESIS_TIMELINE : SCALE_TIMELINE;
  const totalMinutes = track === "genesis" ? 10               : 22;
  const formatLabel  =
    track === "genesis"
      ? "3 Parallel Rooms · 3 Judges / Room · 10 min per team"
      : "Shark Tank Format · 22 min per team";

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-glowPulse" />
          <span className="text-[10px] font-oxanium tracking-widest text-neon-cyan">
            JUDGING GUIDE
          </span>
        </div>
        <h1 className="mt-3 text-[28px] sm:text-[36px] font-oxanium font-semibold tracking-wide text-black leading-tight">
          Hack+ Alebrije · Reference Guide
        </h1>
        <p className="mt-2 text-[13px] font-oxanium tracking-wide text-black/50 max-w-[580px]">
          Use this guide during the event to understand the demo format, scoring
          pillars, and judging outcomes for each track.
        </p>
      </div>

      {/* Track toggle */}
      <TrackToggle active={track} onChange={setTrack} />

      {/* Track context badge */}
      <div className="flex flex-wrap items-center gap-3">
        {track === "genesis" ? (
          <>
            <Chip>~150 participants</Chip>
            <Chip>Up to 40 projects</Chip>
            <Chip>3 parallel rooms</Chip>
          </>
        ) : (
          <>
            <Chip tone="purple">~8 advanced teams</Chip>
            <Chip tone="purple">SCF-style evaluation</Chip>
            <Chip tone="purple">Panel deliberation</Chip>
          </>
        )}
      </div>

      {/* Demo Format */}
      <section>
        <SectionLabel>DEMO FORMAT</SectionLabel>
        <TimelineBar
          segments={segments}
          totalMinutes={totalMinutes}
          formatLabel={formatLabel}
        />
      </section>

      {/* Scoring Pillars */}
      <section>
        <SectionLabel>SCORING PILLARS</SectionLabel>
        <PillarGrid pillars={pillars} />
      </section>

      {/* Scoring Method */}
      <section>
        <SectionLabel>SCORING METHOD</SectionLabel>
        <ScoringMethodCard />
      </section>

      {/* Outcomes (Scale only) */}
      {track === "scale" && (
        <section>
          <SectionLabel>POSSIBLE OUTCOMES PER TEAM</SectionLabel>
          <OutcomeCard outcomes={SCALE_OUTCOMES} />
        </section>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[11px] font-oxanium tracking-widest font-semibold text-black/40 uppercase">
      {children}
    </div>
  );
}

function Chip({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "purple";
}) {
  const cls =
    tone === "cyan"
      ? "border-neon-cyan/25 bg-neon-cyan/8 text-neon-cyan"
      : "border-neon-purple/25 bg-neon-purple/8 text-neon-purple";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-oxanium tracking-widest font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
