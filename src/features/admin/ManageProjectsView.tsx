"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Search, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DbProject } from "@/lib/db/projects";

export default function ManageProjectsView({ projects: initial }: { projects: DbProject[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.track ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDeleteOne(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/delete-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unknown error");
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteAll() {
    setDeletingAll(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/delete-all-projects", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unknown error");
      }
      setProjects([]);
      setConfirmDeleteAll(false);
      router.refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeletingAll(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-neon-purple/10 px-3 py-1 border border-neon-purple/20 mb-3">
          <span className="h-2 w-2 rounded-full bg-neon-purple" />
          <span className="text-[10px] font-oxanium tracking-widest text-neon-purple">ADMIN</span>
        </div>
        <h1 className="text-[26px] font-oxanium tracking-wider font-semibold text-black">
          Manage Projects
        </h1>
        <p className="mt-1 text-[13px] font-oxanium tracking-wider text-black/50">
          Remove individual projects or clear all data from the database. Scores cascade-delete automatically.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-oxanium tracking-wider font-semibold text-red-700">Operation failed</div>
            <div className="text-[11px] font-oxanium tracking-wider text-red-500 mt-0.5 break-all">{error}</div>
          </div>
          <button onClick={() => setError(null)} className="ml-auto shrink-0">
            <X className="h-4 w-4 text-red-400 hover:text-red-600" />
          </button>
        </div>
      )}

      {/* Export scores */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-[11px] font-oxanium tracking-widest font-semibold text-black/50 mb-3">
          EXPORT SCORES
        </div>
        <p className="text-[12px] font-oxanium tracking-wider text-black/55 mb-4">
          Download all evaluation scores and feedback as CSV. One row per judge per project.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/admin/export-scores?track=genesis"
            className="inline-flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-2.5 text-[11px] font-oxanium tracking-widest font-semibold text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            GENESIS CSV
          </a>
          <a
            href="/api/admin/export-scores?track=scale"
            className="inline-flex items-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/5 px-4 py-2.5 text-[11px] font-oxanium tracking-widest font-semibold text-neon-purple hover:bg-neon-purple/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            SCALE CSV
          </a>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <div className="text-[11px] font-oxanium tracking-widest font-semibold text-red-500 mb-2">
          DANGER ZONE
        </div>
        {confirmDeleteAll ? (
          <div className="space-y-3">
            <p className="text-[13px] font-oxanium tracking-wider text-red-700 font-semibold">
              Are you sure? This will permanently delete all {projects.length} projects and their scores.
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="bg-red-600 hover:bg-red-700 text-white border-0 h-9 px-5 text-[11px] font-oxanium tracking-widest"
              >
                {deletingAll ? "DELETING..." : "YES, DELETE ALL"}
              </Button>
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="text-[11px] font-oxanium tracking-widest text-black/50 hover:text-black transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-[12px] font-oxanium tracking-wider text-black/55">
              Delete all projects and associated scores from the database.
            </p>
            <Button
              onClick={() => setConfirmDeleteAll(true)}
              disabled={projects.length === 0}
              className="shrink-0 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 h-9 px-4 text-[11px] font-oxanium tracking-widest shadow-none"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              DELETE ALL ({projects.length})
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, or track..."
          className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2.5 text-[13px] font-oxanium tracking-wider outline-none focus:ring-2 focus:ring-neon-cyan/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-black/30 hover:text-black/60" />
          </button>
        )}
      </div>

      {/* Projects table */}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
          <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70">
            {filtered.length} PROJECT{filtered.length !== 1 ? "S" : ""}
            {search ? ` MATCHING "${search.toUpperCase()}"` : ""}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-[12px] font-oxanium tracking-widest text-black/35">
            {projects.length === 0 ? "No projects in database." : "No projects match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="px-5 py-3 text-[10px] font-oxanium tracking-widest text-black/45">NAME</th>
                  <th className="px-5 py-3 text-[10px] font-oxanium tracking-widest text-black/45">TRACK</th>
                  <th className="px-5 py-3 text-[10px] font-oxanium tracking-widest text-black/45">BUIDL ID</th>
                  <th className="px-5 py-3 text-[10px] font-oxanium tracking-widest text-black/45">TEAM</th>
                  <th className="px-5 py-3 text-[10px] font-oxanium tracking-widest text-black/45 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 hover:bg-black/[0.01] group">
                    <td className="px-5 py-3 text-[13px] font-oxanium tracking-wider font-semibold text-black max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-oxanium tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          background: (p.track ?? "").toLowerCase() === "scale"
                            ? "rgba(179,92,255,0.1)"
                            : "rgba(0,179,212,0.1)",
                          color: (p.track ?? "").toLowerCase() === "scale"
                            ? "#B35CFF"
                            : "#00B3D4",
                        }}
                      >
                        {p.track ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[11px] font-oxanium tracking-wider text-black/40 max-w-[120px] truncate">
                      {p.id}
                    </td>
                    <td className="px-5 py-3 text-[11px] font-oxanium tracking-wider text-black/50 max-w-[150px] truncate">
                      {p.team_members ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDeleteOne(p.id)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-oxanium tracking-widest text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        {deletingId === p.id ? "..." : "DELETE"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
