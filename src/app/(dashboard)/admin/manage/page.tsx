import ManageProjectsView from "@/features/admin/ManageProjectsView";
import { getProjects } from "@/lib/db/projects";

export default async function ManageProjectsPage() {
  let projects = await getProjects().catch(() => []);
  return <ManageProjectsView projects={projects} />;
}
