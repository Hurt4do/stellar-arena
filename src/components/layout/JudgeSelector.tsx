"use client";

import { useEffect, useState, useCallback } from "react";
import { UserRound, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getJudges, createJudge, type DbJudge } from "@/lib/db/judges";

const STORAGE_KEY = "baf_judge_id";
const STORAGE_NAME_KEY = "baf_judge_name";

export function useActiveJudge() {
  const [judgeId, setJudgeId] = useState<string | null>(null);
  const [judgeName, setJudgeName] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    const name = localStorage.getItem(STORAGE_NAME_KEY);
    if (id && name) {
      setJudgeId(id);
      setJudgeName(name);
    }
  }, []);

  const selectJudge = useCallback((judge: DbJudge) => {
    localStorage.setItem(STORAGE_KEY, judge.id);
    localStorage.setItem(STORAGE_NAME_KEY, judge.name);
    setJudgeId(judge.id);
    setJudgeName(judge.name);
  }, []);

  return { judgeId, judgeName, selectJudge };
}

export default function JudgeSelector() {
  const { judgeId, judgeName, selectJudge } = useActiveJudge();
  const [showModal, setShowModal] = useState(false);
  const [judges, setJudges] = useState<DbJudge[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-open on first visit (no judge selected)
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShowModal(true);
    }
  }, []);

  const loadJudges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJudges();
      setJudges(data);
    } catch {
      setError("Could not load judges. Check your Supabase config.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) loadJudges();
  }, [showModal, loadJudges]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const judge = await createJudge(newName.trim());
      setJudges((prev) => [...prev, judge].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    } catch {
      setError("Could not create judge.");
    } finally {
      setCreating(false);
    }
  };

  const handleSelect = (judge: DbJudge) => {
    selectJudge(judge);
    setShowModal(false);
  };

  return (
    <>
      {/* Topbar trigger */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-black/10 shadow-[0_0_30px_rgba(0,179,212,0.08)] px-3 py-1.5 hover:from-neon-cyan/30 hover:to-neon-purple/30 transition-colors"
      >
        <UserRound className="h-4 w-4 text-black/75" />
        {judgeName ? (
          <span className="text-[11px] font-oxanium tracking-widest text-black/75 hidden sm:block max-w-[120px] truncate">
            {judgeName}
          </span>
        ) : (
          <span className="text-[11px] font-oxanium tracking-widest text-black/45 hidden sm:block">
            SELECT JUDGE
          </span>
        )}
        <ChevronDown className="h-3 w-3 text-black/45" />
      </button>

      {/* Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-black/10 bg-white shadow-[0_40px_100px_rgba(2,6,23,0.15)] p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/10 px-3 py-1 border border-neon-cyan/20 mb-4">
              <span className="h-2 w-2 rounded-full bg-neon-cyan" />
              <span className="text-[10px] font-oxanium tracking-widest text-neon-cyan">JUDGE IDENTITY</span>
            </div>

            <h2 className="text-[26px] font-oxanium font-semibold tracking-wide text-black">
              Who are you?
            </h2>
            <p className="mt-1 text-[13px] font-oxanium tracking-wider text-black/50">
              Select your judge profile. Your scores will be tied to this identity.
            </p>

            <div className="mt-5 space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {loading && (
                <div className="text-[12px] font-oxanium tracking-widest text-black/40 py-4 text-center">
                  LOADING...
                </div>
              )}
              {!loading && judges.length === 0 && (
                <div className="text-[12px] font-oxanium tracking-widest text-black/40 py-4 text-center">
                  No judges yet. Add the first one below.
                </div>
              )}
              {judges.map((judge) => (
                <button
                  key={judge.id}
                  type="button"
                  onClick={() => handleSelect(judge)}
                  className={[
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors text-left",
                    judgeId === judge.id
                      ? "border-neon-cyan/50 bg-neon-cyan/5"
                      : "border-black/10 bg-white hover:bg-black/[0.02]",
                  ].join(" ")}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-black/10 flex items-center justify-center shrink-0">
                    <UserRound className="h-4 w-4 text-black/60" />
                  </div>
                  <span className="text-[13px] font-oxanium tracking-wider font-semibold text-black">
                    {judge.name}
                  </span>
                  {judgeId === judge.id && (
                    <span className="ml-auto text-[10px] font-oxanium tracking-widest text-neon-cyan">
                      ACTIVE
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Add new judge */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Add new judge name..."
                className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-oxanium tracking-wider outline-none focus:ring-2 focus:ring-neon-cyan/30"
              />
              <Button
                type="button"
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                variant="secondary"
                className="rounded-xl px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <p className="mt-2 text-[11px] font-oxanium tracking-wider text-red-500">{error}</p>
            )}

            {judgeId && (
              <div className="mt-4 pt-4 border-t border-black/10">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="default"
                  className="w-full"
                >
                  CONTINUE AS {judgeName?.toUpperCase()}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
