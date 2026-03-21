type Track = "genesis" | "scale";

interface TrackToggleProps {
  active: Track;
  onChange: (t: Track) => void;
}

export default function TrackToggle({ active, onChange }: TrackToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
      {(["genesis", "scale"] as Track[]).map((track) => (
        <button
          key={track}
          onClick={() => onChange(track)}
          className={[
            "rounded-full px-6 py-2 text-[11px] font-oxanium tracking-widest font-semibold transition-all duration-200",
            active === track
              ? "bg-neon-cyan text-black shadow-[0_0_16px_rgba(0,179,212,0.35)]"
              : "text-black/50 hover:text-black",
          ].join(" ")}
        >
          {track === "genesis" ? "GENESIS TRACK" : "SCALE TRACK"}
        </button>
      ))}
    </div>
  );
}
