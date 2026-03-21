import PillarDonut, { type Pillar } from "./PillarDonut";

export default function PillarGrid({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {pillars.map((p) => (
        <PillarDonut key={p.name} pillar={p} />
      ))}
    </div>
  );
}
