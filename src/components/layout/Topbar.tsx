"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/auth";
import LogoutButton from "@/components/layout/LogoutButton";

type NavItem = { label: string; href: string };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  builder: [
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  mentor: [
    { label: "Dashboard",   href: "/overview" },
    { label: "Projects",    href: "/projects" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  admin: [
    { label: "Dashboard",   href: "/overview" },
    { label: "Projects",    href: "/projects" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
};

const TRACK_LABEL: Record<string, string> = {
  genesis: "GENESIS",
  scale:   "SCALE",
};

export default function Topbar({
  role,
  judgeName,
  track,
}: {
  role: Role;
  judgeName: string | null;
  track: "genesis" | "scale" | null;
}) {
  const pathname = usePathname();
  const topNav = NAV_BY_ROLE[role];

  return (
    <header className="h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between border-b border-black/10 bg-[linear-gradient(180deg,rgba(247,249,255,0.95),rgba(241,245,255,0.85))]">
      <div className="flex items-center gap-4 md:gap-10 min-w-0">
        <div className="sr-only">STELLAR_ARENA</div>
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
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[6px] h-[2px] bg-neon-cyan/80 shadow-[0_0_20px_rgba(0,179,212,0.28)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: user chip */}
      <div className="flex items-center gap-3 pl-2 shrink-0">
        {track && (
          <span className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[10px] font-oxanium tracking-widest font-semibold border"
            style={{ color: "#00B3D4", borderColor: "rgba(0,179,212,0.3)", background: "rgba(0,179,212,0.07)" }}>
            {TRACK_LABEL[track]}
          </span>
        )}
        {judgeName && (
          <span className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[10px] font-oxanium tracking-widest text-black/55 border border-black/10 bg-white max-w-[140px] truncate">
            {judgeName}
          </span>
        )}
        {/* Logout visible in topbar on mobile (sidebar hidden) */}
        <span className="md:hidden">
          <LogoutButton />
        </span>
      </div>
    </header>
  );
}
