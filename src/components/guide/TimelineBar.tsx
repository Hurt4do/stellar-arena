export interface TimelineSegment {
  label: string;
  minutes: number;
  color: string;
  textColor: string;
  legendColor: string;
}

interface TimelineBarProps {
  segments: TimelineSegment[];
  totalMinutes: number;
  formatLabel: string;
}

export default function TimelineBar({ segments, totalMinutes, formatLabel }: TimelineBarProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      {/* Format context */}
      <p className="mb-4 text-[11px] font-oxanium tracking-widest text-black/45 uppercase">
        {formatLabel}
      </p>

      {/* Segmented bar */}
      <div className="flex h-12 w-full overflow-hidden rounded-xl">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} flex items-center justify-center`}
            style={{ width: `${(seg.minutes / totalMinutes) * 100}%` }}
          >
            <span className={`hidden sm:block text-[10px] font-oxanium tracking-wider font-semibold ${seg.textColor} select-none`}>
              {seg.minutes}m
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: seg.legendColor }}
            />
            <span className="text-[11px] font-oxanium tracking-wider text-black/55">
              {seg.minutes} min · {seg.label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-oxanium tracking-wider text-black/35">
            Total: {totalMinutes} min
          </span>
        </div>
      </div>
    </div>
  );
}
