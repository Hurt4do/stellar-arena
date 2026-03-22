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
    subCriteria: [
      "Real financial pain point in LATAM / Mexico",
      "Clear target user and evidence of need",
      "Market opportunity and local context",
    ],
    color: "cyan",
  },
  {
    name: "Solution & Product",
    weight: 20,
    subCriteria: [
      "Builds on existing Stellar building blocks",
      "Clear value prop vs. existing solutions",
      "Does not reinvent the wheel — composes",
    ],
    color: "purple",
  },
  {
    name: "UX / UI",
    weight: 10,
    subCriteria: [
      "Accessible to non-technical / unbanked users",
      "Reduces web3 friction in financial flows",
      "User flow clarity and interface polish",
    ],
    color: "amber",
  },
  {
    name: "Stellar & Ecosystem",
    weight: 30,
    subCriteria: [
      "Integrates with anchors, local assets (MXNe, USDC, etc.)",
      "Uses DeFi protocols, wallets, or SEPs meaningfully",
      "Composability mindset — plugs into existing infra",
    ],
    color: "cyan",
  },
  {
    name: "Technical Implementation",
    weight: 20,
    subCriteria: [
      "Working demo on Stellar — not mockups",
      "Integration depth and quality",
      "Stable, functional product within hackathon scope",
    ],
    color: "purple",
  },
];

const GENESIS_PRIZES: Outcome[] = [
  {
    label: "1st Place",
    amount: "$4,000 USDC",
    description: "Top project across all Genesis categories — best integration, strongest product.",
    tone: "cyan",
  },
  {
    label: "2nd Place",
    amount: "$2,500 USDC",
    description: "Runner-up — outstanding execution and Stellar ecosystem integration.",
    tone: "purple",
  },
  {
    label: "3rd Place",
    amount: "$1,500 USDC",
    description: "Third-best — solid build with meaningful use of Stellar building blocks.",
    tone: "gray",
  },
];

const GENESIS_CATEGORIES = [
  {
    name: "Payments",
    color: "#00B3D4",
    bg: "rgba(0,179,212,0.06)",
    border: "rgba(0,179,212,0.18)",
    examples: "Remittances, merchant payments, payroll, disbursements via local anchors & payment rails",
  },
  {
    name: "DeFi & Real-World Assets",
    color: "#B35CFF",
    bg: "rgba(179,92,255,0.06)",
    border: "rgba(179,92,255,0.18)",
    examples: "Yield products, lending interfaces, AMMs, swap tools with fiat on-ramp using local assets",
  },
  {
    name: "Local Financial Tools",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
    examples: "Micro-savings for informal workers, community tandas on Soroban, financial access for unbanked",
  },
  {
    name: "Open Integration",
    color: "rgba(0,0,0,0.5)",
    bg: "rgba(0,0,0,0.03)",
    border: "rgba(0,0,0,0.1)",
    examples: "Embedded wallet SDKs, localized on-ramps, freelancer tools — any user-facing financial app on Stellar",
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
    subCriteria: [
      "Delivered the feature / improvement scoped for this hackathon",
      "Clear before / after delta visible to judges",
      "Ability to ship under time constraints",
    ],
    color: "cyan",
  },
  {
    name: "Product Maturity & Market Fit",
    weight: 20,
    subCriteria: [
      "Traction or validated demand (users, pilots, waitlists)",
      "Differentiated from existing ecosystem solutions",
      "Viable as a business or sustainable project beyond grants",
    ],
    color: "purple",
  },
  {
    name: "Technical Architecture",
    weight: 20,
    subCriteria: [
      "Meaningful Stellar / Soroban usage — not superficial",
      "Integration with anchors, SAC, DeFi protocols, SEPs",
      "Security considerations, code quality, stability",
    ],
    color: "cyan",
  },
  {
    name: "Funding Readiness",
    weight: 20,
    subCriteria: [
      "Milestones that map to SCF's 4-tranche structure",
      "Realistic scope for Instaward ($15K) or Build ($150K)",
      "Team capacity and commitment to execute 3–5 month build",
    ],
    color: "amber",
  },
  {
    name: "Ecosystem Value & Mentorship",
    weight: 15,
    subCriteria: [
      "Strengthens ecosystem through integration & composability",
      "Quality of mentorship provided to assigned Genesis teams",
      "Proactive engagement and visibility during the hackathon",
    ],
    color: "purple",
  },
];

const SCALE_OUTCOMES: Outcome[] = [
  {
    label: "Instaward Recommendation",
    amount: "Up to $15K",
    description: "Strong potential but needs more work. Funds a specific gap: technical refinement, user testing, or a key integration before SCF Build.",
    tone: "cyan",
  },
  {
    label: "Direct SCF Build Referral",
    amount: "Up to $150K",
    description: "Product is mature enough to enter SCF Build Award pipeline. Strong architecture, validated demand, and a realistic mainnet roadmap.",
    tone: "purple",
  },
  {
    label: "Continue Building",
    amount: "—",
    description: "Needs more development time. Panel provides constructive feedback on what to work on before any funding recommendation.",
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
      : "Shark Tank Format · Full Panel · 22 min per team";

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
            <Chip>Integration track</Chip>
          </>
        ) : (
          <>
            <Chip tone="purple">~8 advanced teams</Chip>
            <Chip tone="purple">SCF-style evaluation</Chip>
            <Chip tone="purple">Panel deliberation</Chip>
            <Chip tone="purple">Full 3-day assessment</Chip>
          </>
        )}
      </div>

      {/* Genesis: Categories */}
      {track === "genesis" && (
        <section>
          <SectionLabel>TRACK CATEGORIES</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GENESIS_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border p-4"
                style={{ background: cat.bg, borderColor: cat.border }}
              >
                <div
                  className="text-[11px] font-oxanium tracking-widest font-semibold mb-1.5"
                  style={{ color: cat.color }}
                >
                  {cat.name.toUpperCase()}
                </div>
                <p className="text-[11px] font-oxanium tracking-wide text-black/55 leading-relaxed">
                  {cat.examples}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-oxanium tracking-wide text-black/40">
            All categories compete for the same prize pool and are judged on the same criteria.
          </p>
        </section>
      )}

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

      {/* Genesis: Prizes */}
      {track === "genesis" && (
        <section>
          <SectionLabel>PRIZE POOL — $8,000 USDC</SectionLabel>
          <OutcomeCard outcomes={GENESIS_PRIZES} />
          <p className="mt-3 text-[11px] font-oxanium tracking-wide text-black/40">
            Top Genesis projects are also invited to the Alebrije Accelerator and can apply for SCF Build Awards of up to $150,000 in XLM.
          </p>
        </section>
      )}

      {/* Scale: Outcomes */}
      {track === "scale" && (
        <section>
          <SectionLabel>POSSIBLE OUTCOMES PER TEAM</SectionLabel>
          <OutcomeCard outcomes={SCALE_OUTCOMES} />
        </section>
      )}

      {/* Scale: Judging flow note */}
      {track === "scale" && (
        <section>
          <SectionLabel>3-DAY JUDGING FLOW</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { day: "Day 1", label: "Baseline Review", desc: "Receive team list, scope documents, GitHub/demo links. Establish starting state." },
              { day: "Day 2", label: "Progress Check-in", desc: "Observe Scale teams' check-ins with assigned Genesis teams during the 6–7 PM checkpoint block." },
              { day: "Day 3", label: "Shark Tank Demo Day", desc: "22-min sessions per team: 6 min pitch, 8 min Q&A, 8 min feedback. Full panel present." },
            ].map(({ day, label, desc }) => (
              <div key={day} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-[9px] font-oxanium tracking-widest text-neon-purple font-semibold mb-1">{day.toUpperCase()}</div>
                <div className="text-[12px] font-oxanium tracking-wider font-semibold text-black mb-2">{label}</div>
                <p className="text-[11px] font-oxanium tracking-wide text-black/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
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
