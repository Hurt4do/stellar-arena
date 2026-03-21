"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/overview");
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{
        background: "linear-gradient(to bottom, #f7f9ff, #eef2ff)",
        color: "#0b1220",
        fontFamily: "var(--font-oxanium), sans-serif",
      }}
    >
      <p className="text-lg font-semibold tracking-wider">Judge Portal</p>
      <p className="text-sm text-black/60">Redirigiendo al dashboard...</p>
      <Link
        href="/overview"
        className="px-6 py-3 rounded-xl border border-black/10 bg-white font-semibold tracking-wider hover:bg-black/5 transition-colors"
      >
        Ir a Overview
      </Link>
    </div>
  );
}
