"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Rocket, Sparkles, TrendingUp, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/app/public/BAF1.png";
import { upsertScores } from "@/lib/db/scores";
import { upsertFeedback } from "@/lib/db/scores";
import type { DbRubricCriterion } from "@/lib/db/rubric";

function stageClass(isVisible: boolean) {
  return cn(
    "transition-all duration-500 ease-out",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
  );
}

type PitchTag = "CONFIDENT" | "CLEAR" | "CREATIVE";
type ScaleOutcome = "INSTAWARD" | "SCF_BUILD" | "CONTINUE_BUILDING";

export default function EvaluationStepOneView({
  projectId,
  projectName,
  track,
  criteria,
  judgeId,
}: {
  projectId: string;
  projectName: string;
  track: string;
  criteria: DbRubricCriterion[];
  judgeId: string | null;
}) {
  const [stage, setStage] = useState(0);
  const [blockIndex, setBlockIndex] = useState(0);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [scores, setScores] = useState<number[]>(() => criteria.map(() => 0));
  const [comments, setComments] = useState<string[]>(() => criteria.map(() => ""));
  const [pitchTags, setPitchTags] = useState<PitchTag[]>([]);
  const [finalComment, setFinalComment] = useState("");
  const [scaleOutcome, setScaleOutcome] = useState<ScaleOutcome | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isScale = track.toLowerCase() === "scale";
  const currentBlock = criteria[blockIndex];
  const score = scores[blockIndex] ?? 0;
  const rawTotalScore = scores.reduce((acc, n) => acc + n, 0);
  const maxTotalScore = criteria.reduce((acc, b) => acc + b.max_score, 0);
  const totalScore = maxTotalScore > 0 ? Math.round((rawTotalScore / maxTotalScore) * 100) : 0;
  const progressPct = criteria.length > 0 ? Math.round(((blockIndex + 1) / criteria.length) * 100) : 0;

  const updateScore = (newScore: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[blockIndex] = newScore;
      return next;
    });
  };

  const updateComment = (text: string) => {
    setComments((prev) => {
      const next = [...prev];
      next[blockIndex] = text;
      return next;
    });
  };

  const handleProceed = () => {
    if (blockIndex < criteria.length - 1) {
      setBlockIndex((i) => i + 1);
      return;
    }
    setShowFinalScreen(true);
  };

  const handleBack = () => {
    if (blockIndex > 0) setBlockIndex((i) => i - 1);
  };

  const togglePitchTag = (tag: PitchTag) => {
    setPitchTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!judgeId) {
      setSubmitError("No judge ID found. Please log out and log in again as a Mentor.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const inputs = criteria.map((c, i) => ({
        project_id: projectId,
        judge_id: judgeId,
        criterion_id: c.id,
        score: scores[i] ?? 0,
        comments: comments[i] || undefined,
      }));
      await upsertScores(inputs);
      await upsertFeedback({
        project_id: projectId,
        judge_id: judgeId,
        final_comment: finalComment || undefined,
        pitch_tags: pitchTags.length > 0 ? pitchTags : undefined,
        outcome: isScale && scaleOutcome ? scaleOutcome : undefined,
      });
      setShowSuccessScreen(true);
    } catch (err) {
      setSubmitError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const timeline = [120, 340, 600, 860, 1120];
    const timers = timeline.map((delay, idx) =>
      window.setTimeout(() => setStage(idx + 1), delay),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  // Guard: no criteria loaded
  if (criteria.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
        <div className="text-[13px] font-oxanium tracking-widest text-black/40">
          No rubric found for track <span className="text-neon-cyan">{track}</span>.
          Please run the schema migration in Supabase.
        </div>
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <div className="rounded-2xl border border-black/10 bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] p-4 sm:p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 md:gap-10 items-center">
          <div className="relative">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_20px_60px_rgba(2,6,23,0.08)]">
              <div className="relative h-[260px] sm:h-[320px] rounded-xl bg-[radial-gradient(circle_at_20%_20%,rgba(0,179,212,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(179,92,255,0.18),transparent_45%),linear-gradient(145deg,#f6fbff,#e9f1ff)] border border-black/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={logo}
                    alt="Project reviewed"
                    width={180}
                    height={180}
                    className="h-[130px] w-[130px] sm:h-[180px] sm:w-[180px] object-contain drop-shadow-[0_12px_30px_rgba(0,179,212,0.28)]"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -top-4 right-4 rounded-xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(2,6,23,0.10)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-neon-cyan" />
                <div>
                  <div className="text-[9px] font-oxanium tracking-widest text-black/45">STATUS</div>
                  <div className="text-[12px] font-oxanium tracking-wider font-semibold text-black/75">
                    SYNC_COMPLETE
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neon-purple/10 px-3 py-1 border border-neon-purple/20">
              <span className="h-2 w-2 rounded-full bg-neon-purple" />
              <span className="text-[10px] font-oxanium tracking-widest text-neon-purple">PROJECT REVIEWED</span>
            </div>

            <h2 className="mt-4 text-[42px] sm:text-[54px] leading-[0.98] font-oxanium font-semibold tracking-wide text-black">
              Evaluation
              <br />
              Completed
            </h2>

            <p className="mt-4 text-[18px] font-oxanium tracking-wide text-black/65 max-w-[620px]">
              Thank you for your valuable time and feedback. Your evaluation has been
              successfully recorded.
            </p>

            <div className="mt-8">
              <Button asChild variant="default" className="h-14 px-8 sm:min-w-[320px] justify-between">
                <Link href="/overview">
                  RETURN TO DASHBOARD
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalScreen) {
    return (
      <div className="space-y-4">
        <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] font-oxanium tracking-widest text-black/55">
              FINAL REFLECTION
            </div>
            <div className="text-[18px] font-oxanium tracking-wider text-neon-cyan font-semibold">
              100%
            </div>
          </div>
          <div className="mt-3 h-[3px] bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan rounded-full" style={{ width: "100%" }} />
          </div>

          <div className="mt-5 sm:mt-7 rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(0,179,212,0.04),rgba(179,92,255,0.03))] p-4 sm:p-6 md:p-8">
            <h2 className="text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.06] sm:leading-[1.04] font-oxanium font-semibold tracking-wide text-black">
              Final thoughts on the{" "}
              <span className="text-neon-cyan">Pitch &amp; Presentation?</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[18px] font-oxanium tracking-wide text-black/60 max-w-[820px]">
              Analyze the delivery, narrative flow, and overall impact of the
              project&apos;s verbal and visual representation.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { label: "CONFIDENT" as PitchTag, Icon: Rocket },
                { label: "CLEAR" as PitchTag, Icon: Eye },
                { label: "CREATIVE" as PitchTag, Icon: Sparkles },
              ]).map(({ label, Icon }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => togglePitchTag(label)}
                  className={cn(
                    "rounded-xl border px-4 py-6 transition-colors",
                    pitchTags.includes(label)
                      ? "border-neon-cyan/50 bg-neon-cyan/5"
                      : "border-black/10 bg-white hover:bg-black/[0.03]",
                  )}
                >
                  <div className="flex items-center justify-center">
                    <Icon className={cn("h-5 w-5", pitchTags.includes(label) ? "text-neon-cyan" : "text-black/70")} />
                  </div>
                  <div className="mt-3 text-[11px] font-oxanium tracking-widest text-black/65">
                    {label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-7">
              <div className="text-[12px] font-oxanium tracking-widest font-semibold text-neon-cyan">
                ADDITIONAL OBSERVATIONS
              </div>
              <textarea
                rows={5}
                value={finalComment}
                onChange={(e) => setFinalComment(e.target.value)}
                className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-oxanium tracking-wider outline-none focus:ring-2 focus:ring-neon-cyan/30"
                placeholder="Briefly log terminal feedback here..."
              />
            </div>
          </div>

          {/* Scale-only: outcome selector */}
          {isScale && (
            <div className="mt-6 rounded-2xl border border-neon-purple/20 bg-neon-purple/5 p-4 sm:p-6">
              <div className="text-[11px] font-oxanium tracking-widest font-semibold text-neon-purple mb-1">
                SCF PANEL RECOMMENDATION
              </div>
              <p className="text-[12px] font-oxanium tracking-wider text-black/50 mb-4">
                Based on your evaluation, what outcome do you recommend for this team?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  {
                    key: "INSTAWARD" as ScaleOutcome,
                    label: "Instaward",
                    sub: "Up to $15K",
                    Icon: Award,
                    color: "#00B3D4",
                    bg: "rgba(0,179,212,0.06)",
                    border: "rgba(0,179,212,0.3)",
                  },
                  {
                    key: "SCF_BUILD" as ScaleOutcome,
                    label: "SCF Build",
                    sub: "Up to $150K",
                    Icon: TrendingUp,
                    color: "#B35CFF",
                    bg: "rgba(179,92,255,0.06)",
                    border: "rgba(179,92,255,0.3)",
                  },
                  {
                    key: "CONTINUE_BUILDING" as ScaleOutcome,
                    label: "Continue Building",
                    sub: "Not ready yet",
                    Icon: BookOpen,
                    color: "rgba(0,0,0,0.4)",
                    bg: "transparent",
                    border: "rgba(0,0,0,0.12)",
                  },
                ]).map(({ key, label, sub, Icon, color, bg, border }) => {
                  const active = scaleOutcome === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setScaleOutcome(active ? null : key)}
                      className="rounded-xl border px-4 py-5 text-left transition-all"
                      style={{
                        background: active ? bg : "white",
                        borderColor: active ? border : "rgba(0,0,0,0.1)",
                        boxShadow: active ? `0 0 16px ${bg}` : "none",
                      }}
                    >
                      <Icon className="h-5 w-5 mb-3" style={{ color }} />
                      <div className="text-[12px] font-oxanium tracking-wider font-semibold" style={{ color: active ? color : "rgba(0,0,0,0.75)" }}>
                        {label}
                      </div>
                      <div className="text-[10px] font-oxanium tracking-widest text-black/40 mt-0.5">
                        {sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {submitError && (
            <p className="mt-3 text-[12px] font-oxanium tracking-wider text-red-500">{submitError}</p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowFinalScreen(false)}
              className="inline-flex items-center gap-2 text-[11px] font-oxanium tracking-widest text-black/55 hover:text-black transition-colors order-1 sm:order-none"
            >
              <ArrowLeft className="h-4 w-4" />
              PREVIOUS
            </button>

            <div className="rounded-full border border-black/10 bg-white px-5 py-2 text-center order-2 sm:order-none self-center">
              <div className="text-[9px] font-oxanium tracking-widest text-black/45">
                TOTAL EVAL
              </div>
              <div className="text-[18px] font-oxanium tracking-wider font-semibold text-neon-cyan">
                {totalScore}/100
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              variant="default"
              className="h-12 w-full sm:w-auto sm:min-w-[180px] order-3 sm:order-none"
            >
              {submitting ? "SAVING..." : "Submit review"}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Track + project label */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 px-3 py-1 border border-neon-cyan/20">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
          <span className="text-[10px] font-oxanium tracking-widest text-neon-cyan">{track.toUpperCase()} TRACK</span>
        </span>
        <span className="text-[11px] font-oxanium tracking-widest text-black/40">{projectName}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <section className={cn("rounded-2xl border border-black/10 bg-white p-4 sm:p-6 md:p-8", stageClass(stage >= 1))}>
          {/* Progress bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] font-oxanium tracking-widest text-black/55">
              {currentBlock.pillar_name.toUpperCase()}
            </div>
            <div className="text-[18px] font-oxanium tracking-wider text-neon-cyan font-semibold">
              {progressPct}%
            </div>
          </div>
          <div className="mt-3 h-[3px] bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan rounded-full" style={{ width: `${progressPct}%` }} />
          </div>

          <div className={cn("mt-5 sm:mt-7 rounded-2xl border border-black/10 bg-[linear-gradient(180deg,rgba(0,179,212,0.04),rgba(179,92,255,0.03))] p-4 sm:p-6 md:p-8", stageClass(stage >= 3))}>
            <div className="text-[11px] font-oxanium tracking-widest text-black/45 mb-3">
              CRITERION {String(blockIndex + 1).padStart(2, "0")}/{String(criteria.length).padStart(2, "0")}
            </div>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.06] font-oxanium font-semibold tracking-wide text-black">
              <span className="text-neon-cyan">{currentBlock.pillar_name}</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[17px] font-oxanium tracking-wide text-black/60 max-w-[820px]">
              {currentBlock.description}
            </p>

            <div className="mt-7 sm:mt-10">
              <input
                type="range"
                min={0}
                max={currentBlock.max_score}
                value={score}
                onChange={(e) => updateScore(Number(e.target.value))}
                className="w-full accent-[#00B3D4]"
              />
              <div className="mt-2 flex items-center justify-between text-[10px] font-oxanium tracking-widest text-black/35">
                <span>IRRELEVANT</span>
                <span>GAME_CHANGER</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="text-[52px] sm:text-[64px] leading-none font-oxanium font-semibold text-neon-cyan">
                {score}
                <span className="text-[24px] sm:text-[30px] text-black/40">
                  /{currentBlock.max_score}
                </span>
              </div>
              <div className="text-[10px] font-oxanium tracking-widest text-black/45 mt-2">
                IMPACT SCORE · {currentBlock.weight_pct}% WEIGHT
              </div>
            </div>

            <div className="mt-7">
              <div className="text-[12px] font-oxanium tracking-widest font-semibold text-neon-cyan">
                JUDGE&apos;S COMMENTS &amp; OBSERVATIONS
              </div>
              <textarea
                rows={5}
                value={comments[blockIndex] ?? ""}
                onChange={(e) => updateComment(e.target.value)}
                className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-oxanium tracking-wider outline-none focus:ring-2 focus:ring-neon-cyan/30"
                placeholder="Enter detailed feedback here..."
              />
            </div>
          </div>

          <div className={cn("mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4", stageClass(stage >= 4))}>
            {blockIndex === 0 ? (
              <Link
                href={`/projects/${projectId}`}
                className="inline-flex items-center gap-2 text-[11px] font-oxanium tracking-widest text-black/55 hover:text-black transition-colors order-1 sm:order-none"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-[11px] font-oxanium tracking-widest text-black/55 hover:text-black transition-colors order-1 sm:order-none"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK
              </button>
            )}

            <div className="rounded-full border border-black/10 bg-white px-5 py-2 text-center order-2 sm:order-none self-center">
              <div className="text-[9px] font-oxanium tracking-widest text-black/45">TOTAL EVAL</div>
              <div className="text-[18px] font-oxanium tracking-wider font-semibold text-neon-cyan">
                {totalScore}/100
              </div>
            </div>

            <Button
              type="button"
              onClick={handleProceed}
              variant="default"
              className="h-12 w-full sm:w-auto sm:min-w-[180px] order-3 sm:order-none"
            >
              {blockIndex === criteria.length - 1 ? "FINAL STEP" : "PROCEED"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
