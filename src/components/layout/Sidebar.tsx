"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  LayoutGrid,
  Trophy,
  Upload,
} from "lucide-react";
import Image from "next/image";
import logo from "@/app/public/BAF1.png";
import type { Role } from "@/lib/auth";
import LogoutButton from "@/components/layout/LogoutButton";

type NavItem = { label: string; href: string; Icon: React.ElementType };

const NAV: Record<Role, NavItem[]> = {
  builder: [
    { label: "Leaderboard", href: "/leaderboard", Icon: Trophy },
  ],
  mentor: [
    { label: "Overview",      href: "/overview",    Icon: LayoutGrid },
    { label: "All Projects",  href: "/projects",    Icon: Boxes },
    { label: "My Scoring",    href: "/my-scoring",  Icon: ClipboardList },
    { label: "Leaderboard",   href: "/leaderboard", Icon: Trophy },
    { label: "Judging Guide", href: "/guide",       Icon: BookOpen },
  ],
  admin: [
    { label: "Overview",      href: "/overview",    Icon: LayoutGrid },
    { label: "All Projects",  href: "/projects",    Icon: Boxes },
    { label: "My Scoring",    href: "/my-scoring",  Icon: ClipboardList },
    { label: "Leaderboard",   href: "/leaderboard", Icon: Trophy },
    { label: "Judging Guide", href: "/guide",       Icon: BookOpen },
    { label: "Import CSV",    href: "/admin/import", Icon: Upload },
  ],
};

const ROLE_COLOR: Record<Role, string> = {
  builder: "#B35CFF",
  mentor:  "#00B3D4",
  admin:   "#F59E0B",
};

function TrackSwitcher({ currentTrack }: { currentTrack: "genesis" | "scale" | null }) {
  const router = useRouter();

  async function switchTo(t: "genesis" | "scale") {
    if (t === currentTrack) return;
    await fetch("/api/auth/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track: t }),
    });
    router.refresh();
  }

  return (
    <div className="mx-3 mb-3 p-1 flex rounded-lg bg-black/5 gap-1">
      {(["genesis", "scale"] as const).map((t) => {
        const active = currentTrack === t;
        return (
          <button
            key={t}
            onClick={() => switchTo(t)}
            className="flex-1 rounded-md py-1.5 text-[9px] font-oxanium tracking-widest font-semibold uppercase transition-all"
            style={{
              background: active ? "#00B3D4" : "transparent",
              color: active ? "#fff" : "rgba(0,0,0,0.4)",
              boxShadow: active ? "0 0 10px rgba(0,179,212,0.3)" : "none",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export default function Sidebar({
  role,
  judgeName,
  track,
}: {
  role: Role;
  judgeName: string | null;
  track: "genesis" | "scale" | null;
}) {
  const pathname = usePathname();
  const navItems = NAV[role];

  return (
    <>
      {/* Full sidebar — md and up */}
      <aside className="hidden md:flex flex-col w-[248px] shrink-0 border-r border-black/10 bg-[linear-gradient(180deg,rgba(245,250,255,0.95),rgba(238,244,255,0.85))]">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center border border-black/10 shadow-[0_0_30px_rgba(0,179,212,0.1)] overflow-hidden shrink-0">
            <Image src={logo} alt="Stellar Arena logo" width={40} height={40} className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-[11px] text-black/55 font-oxanium tracking-widest">STELLAR ARENA</div>
          </div>
        </div>

        {/* Track switcher (mentor only) */}
        {role === "mentor" && <TrackSwitcher currentTrack={track} />}

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = href === "/overview"
              ? pathname.startsWith("/overview")
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative flex items-center gap-3 rounded-xl px-3 py-3 mb-1 transition-colors",
                  isActive ? "bg-black/5" : "hover:bg-black/5",
                ].join(" ")}
              >
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[38px] w-[3px] rounded-r-full"
                  style={{ background: isActive ? "#00B3D4" : "transparent" }}
                />
                <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? "#00B3D4" : "rgba(0,0,0,0.45)" }} />
                <span className="text-[12px] font-oxanium tracking-widest font-semibold" style={{ color: isActive ? "#0b1220" : "rgba(0,0,0,0.5)" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 pb-5 border-t border-black/8 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: ROLE_COLOR[role] }} />
            <span className="text-[10px] font-oxanium tracking-widest text-black/50 uppercase truncate">
              {judgeName ?? role}
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-black/10 bg-white/95 backdrop-blur-sm px-2 py-2">
        {navItems.slice(0, 5).map(({ href, Icon, label }) => {
          const isActive = href === "/overview"
            ? pathname.startsWith("/overview")
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg"
            >
              <Icon className="h-5 w-5" style={{ color: isActive ? "#00B3D4" : "rgba(0,0,0,0.4)" }} />
              <span className="text-[8px] font-oxanium tracking-widest" style={{ color: isActive ? "#00B3D4" : "rgba(0,0,0,0.4)" }}>
                {label.split(" ")[0].toUpperCase()}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
