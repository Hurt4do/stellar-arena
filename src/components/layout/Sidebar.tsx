"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  LayoutGrid,
  Upload,
} from "lucide-react";
import Image from "next/image";
import logo from "@/app/public/BAF1.png";

const navItems = [
  { label: "Overview", href: "/overview", Icon: LayoutGrid },
  { label: "All Projects", href: "/projects", Icon: Boxes },
  { label: "Import CSV", href: "/admin/import", Icon: Upload },
  { label: "Judging Guide", href: "/guide", Icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-[248px] shrink-0 border-r border-black/10 bg-[linear-gradient(180deg,rgba(245,250,255,0.95),rgba(238,244,255,0.85))]">
      <div className="h-16 px-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center border border-black/10 shadow-[0_0_30px_rgba(0,179,212,0.1)] overflow-hidden">
          <Image src={logo} alt="Judge Portal logo" width={40} height={40} className="h-10 w-10 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="sr-only">JUDGE_PORTAL</div>
          <div className="text-[11px] text-black/55 font-oxanium tracking-widest">
            STELLAR ARENA
          </div>
        </div>
      </div>

      <nav className="px-3 pb-6">
        {navItems.map(({ label, href, Icon }) => {
          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href);

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
                className={[
                  "absolute left-0 top-1/2 -translate-y-1/2 h-[38px] w-[3px] rounded-r-full",
                  isActive ? "bg-neon-cyan shadow-[0_0_20px_rgba(0,179,212,0.28)]" : "bg-transparent",
                ].join(" ")}
              />
              <Icon
                className={[
                  "h-4 w-4 shrink-0",
                  isActive ? "text-neon-cyan" : "text-black/45",
                ].join(" ")}
              />
              <span
                className={[
                  "text-[12px] font-oxanium tracking-widest font-semibold",
                  isActive ? "text-black" : "text-black/50",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

