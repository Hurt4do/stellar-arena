export interface Pillar {
  name: string;
  weight: number;
  subCriteria: string[];
  color: "cyan" | "purple" | "amber";
}

const colorMap: Record<Pillar["color"], string> = {
  cyan: "#00B3D4",
  purple: "#B35CFF",
  amber: "#F59E0B",
};

const dotColorMap: Record<Pillar["color"], string> = {
  cyan: "bg-neon-cyan/60",
  purple: "bg-neon-purple/60",
  amber: "bg-amber-400/70",
};

const CIRCUMFERENCE = 2 * Math.PI * 38; // ≈ 238.76

export default function PillarDonut({ pillar }: { pillar: Pillar }) {
  const offset = CIRCUMFERENCE * (1 - pillar.weight / 100);
  const stroke = colorMap[pillar.color];
  const dotClass = dotColorMap[pillar.color];

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 flex flex-col">
      {/* Donut SVG */}
      <svg viewBox="0 0 100 100" className="w-full max-w-[140px] mx-auto">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        {/* Center weight label */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight="700"
          fill="#0b1220"
          fontFamily="Oxanium, sans-serif"
        >
          {pillar.weight}%
        </text>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fill="rgba(11,18,32,0.4)"
          fontFamily="Oxanium, sans-serif"
          letterSpacing="1"
        >
          WEIGHT
        </text>
      </svg>

      {/* Pillar name */}
      <div className="mt-3 text-[12px] font-oxanium tracking-wider font-semibold text-black text-center leading-tight">
        {pillar.name}
      </div>

      {/* Sub-criteria */}
      <ul className="mt-3 space-y-1.5 flex-1">
        {pillar.subCriteria.map((c) => (
          <li key={c} className="flex items-start gap-1.5">
            <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`} />
            <span className="text-[10px] font-oxanium tracking-wide text-black/55 leading-relaxed">
              {c}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
