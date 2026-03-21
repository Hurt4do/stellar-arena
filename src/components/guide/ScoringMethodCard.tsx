export default function ScoringMethodCard() {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formula block */}
        <div className="flex flex-col items-center justify-center lg:w-64 shrink-0">
          <div className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/5 px-8 py-5 text-center">
            <div className="text-[10px] font-oxanium tracking-widest text-black/40 mb-2">
              FINAL SCORE FORMULA
            </div>
            <div className="text-[20px] font-oxanium font-semibold tracking-wide text-neon-cyan">
              (J₁ + J₂ + J₃) ÷ 3
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 grid sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Independent Scoring",
              desc: "Each judge evaluates the project on their own device. Scores are not visible to other judges during the session.",
            },
            {
              step: "02",
              title: "Weighted Pillars",
              desc: "Each scoring pillar carries a defined weight. A judge's total is the sum of (score ÷ max) × weight for all pillars.",
            },
            {
              step: "03",
              title: "Final Average",
              desc: "The project's final score is the arithmetic average of all judge totals. Results update live on the Leaderboard.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="text-[11px] font-oxanium tracking-widest text-neon-cyan/60 font-semibold pt-0.5 shrink-0 w-6">
                {step}
              </div>
              <div>
                <div className="text-[12px] font-oxanium tracking-wider font-semibold text-black mb-1">
                  {title}
                </div>
                <p className="text-[11px] font-oxanium tracking-wide text-black/50 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
