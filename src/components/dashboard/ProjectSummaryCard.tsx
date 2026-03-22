import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export default function ProjectSummaryCard({
  project,
  href,
  tone = "cyan",
}: {
  project: Project;
  href: string;
  tone?: "cyan" | "purple";
}) {
  const borderClass = tone === "cyan" ? "neon-border-cyan" : "neon-border-purple";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col h-full rounded-xl border border-black/10 bg-white p-5 hover:bg-white/80 transition-colors",
        borderClass,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mt-0 text-[20px] font-oxanium tracking-wider font-semibold text-black group-hover:text-black">
            {project.name}
          </div>
        </div>
        <div className="h-10 w-10 rounded-xl border border-black/10 bg-white flex items-center justify-center opacity-80 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-black/70" />
        </div>
      </div>

      {project.description ? (
        <div className="mt-3 text-[12px] font-oxanium tracking-wider text-black/50 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
          {project.description}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {(project.tags ?? []).slice(0, 4).map((t) => (
          <Badge key={t} variant="gray" className="px-2 py-1 rounded-full">
            {t}
          </Badge>
        ))}
      </div>

      {project.github && (
        <div className="mt-3 pt-3 border-t border-black/5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[10px] font-oxanium tracking-widest text-black/45 hover:text-neon-cyan transition-colors"
          >
            <Github className="h-3 w-3" /> GITHUB
          </a>
        </div>
      )}
    </Link>
  );
}

