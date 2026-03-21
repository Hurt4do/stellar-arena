export interface Outcome {
  label: string;
  amount: string;
  description: string;
  tone: "cyan" | "purple" | "gray";
}

const toneClasses: Record<Outcome["tone"], { wrapper: string; amount: string }> = {
  cyan: {
    wrapper: "neon-border-cyan bg-neon-cyan/5",
    amount: "text-neon-cyan",
  },
  purple: {
    wrapper: "neon-border-purple bg-neon-purple/5",
    amount: "text-neon-purple",
  },
  gray: {
    wrapper: "border border-black/10 bg-white",
    amount: "text-black/60",
  },
};

export default function OutcomeCard({ outcomes }: { outcomes: Outcome[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {outcomes.map((o) => {
        const tc = toneClasses[o.tone];
        return (
          <div key={o.label} className={`rounded-xl p-5 ${tc.wrapper}`}>
            <div className="text-[10px] font-oxanium tracking-widest text-black/40 uppercase mb-2">
              {o.label}
            </div>
            <div className={`text-[26px] font-oxanium font-semibold tracking-wide ${tc.amount}`}>
              {o.amount}
            </div>
            <p className="mt-2 text-[11px] font-oxanium tracking-wide text-black/50 leading-relaxed">
              {o.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
