import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{
        background: "linear-gradient(to bottom, #f7f9ff, #eef2ff)",
        color: "#0b1220",
        fontFamily: "var(--font-oxanium), sans-serif",
      }}
    >
      <h1 className="text-2xl font-semibold tracking-wider">404</h1>
      <p className="text-black/70 tracking-wide">Página no encontrada</p>
      <Link
        href="/overview"
        className="px-6 py-3 rounded-xl border border-black/10 bg-white font-semibold tracking-wider hover:bg-black/5 transition-colors"
      >
        Ir al Overview
      </Link>
    </div>
  );
}
