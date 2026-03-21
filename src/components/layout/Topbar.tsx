"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import JudgeSelector from "@/components/layout/JudgeSelector";

const topNav = [
  { label: "Dashboard", href: "/overview" },
  { label: "Projects", href: "/projects" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function Topbar() {
  const pathname = usePathname();

  return (
    <header className="h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between border-b border-black/10 bg-[linear-gradient(180deg,rgba(247,249,255,0.95),rgba(241,245,255,0.85))]">
      <div className="flex items-center gap-4 md:gap-10 min-w-0">
        <div className="sr-only">HEARTBEAT_OS</div>
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {topNav.map((item) => {
            const isActive = item.href === "/overview"
              ? pathname === "/" || pathname.startsWith("/overview")
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-[11px] md:text-[12px] tracking-widest font-oxanium text-black/70 hover:text-black transition-colors relative pb-2 shrink-0",
                  isActive ? "text-black" : "",
                ].join(" ")}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute left-0 right-0 -bottom-[6px] h-[2px] bg-neon-cyan/80 shadow-[0_0_20px_rgba(0,179,212,0.28)]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 pl-2">
        <JudgeSelector />
      </div>
    </header>
  );
}

