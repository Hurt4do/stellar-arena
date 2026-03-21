import ProjectSummaryCard from "@/components/dashboard/ProjectSummaryCard";
import { getProjects } from "@/lib/db/projects";
import type { Project } from "@/types/dashboard";

export default async function ProjectsGridView() {
  let projects: Project[] = [];
  try {
    const data = await getProjects();
    projects = data.map((p) => ({
      ...p,
      description: p.team_description ?? undefined,
      team: p.team_members ?? undefined,
      tags: p.track ? [p.track] : [],
    }));
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mt-2 text-[26px] font-oxanium tracking-wider font-semibold text-black">
          All projects
        </h1>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <div className="text-[13px] font-oxanium tracking-widest text-black/40">
            No projects yet. Upload a DoraHacks CSV from{" "}
            <span className="text-neon-cyan">Import CSV</span> to get started.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, idx) => (
            <ProjectSummaryCard
              key={p.id}
              project={p}
              href={`/projects/${p.id}`}
              tone={idx % 2 === 0 ? "cyan" : "purple"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
