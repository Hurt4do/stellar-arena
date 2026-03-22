"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { upsertProjects, normalizeTrack, type DbProject } from "@/lib/db/projects";

// DoraHacks CSV column headers → DB field mapping
const COL_MAP: Record<string, keyof Omit<DbProject, "created_at">> = {
  "BUIDL ID": "id",
  "BUIDL name": "name",
  "BUIDL profile URL": "profile_url",
  "BUIDL demo link": "demo_link",
  "BUIDL GitHub": "github",
  "Track": "track",
  "Bounties": "bounties",
  "Team members": "team_members",
  "Team description": "team_description",
  "Review status": "review_status",
  "Submission time (UTC)": "submission_time",
  "BUIDL last updated time (UTC)": "last_updated",
  "Countries": "countries",
  "SCF Track Choice": "scf_track_choice",
  "Budget (USD)": "budget_usd",
  "Score: Overall (/100)": "score_overall",
  "Score: Narrative (/25)": "score_narrative",
  "Score: Technical (/30)": "score_technical",
  "Score: Feasibility (/20)": "score_feasibility",
  "Score: Traction (/25)": "score_traction",
  "Website": "website",
  "Twitter / X": "twitter",
  "Video Pitch": "video_pitch",
  "Pitch Deck": "pitch_deck",
  "Docs URL": "docs_url",
  "Architecture URL": "architecture_url",
  "Problem": "problem",
  "Solution": "solution",
  "Key Integrations": "key_integrations",
  "Reviewer Feedback": "reviewer_feedback",
};

function parseCSV(text: string): Record<string, string>[] {
  // Strip UTF-8 BOM (common in Excel/DoraHacks exports)
  const clean = text.replace(/^\uFEFF/, "");

  // Tokenize the entire file respecting quoted newlines
  const fields = tokenize(clean);
  if (fields.length === 0) return [];

  // First row = headers
  const headers = fields[0].map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < fields.length; i++) {
    const values = fields[i];
    if (values.every((v) => v.trim() === "")) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

/** Tokenize a full CSV string into rows×columns, respecting quoted newlines */
function tokenize(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((ch === "\r" || ch === "\n") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++; // skip \r\n pair
      row.push(current);
      current = "";
      rows.push(row);
      row = [];
    } else {
      current += ch;
    }
  }
  // Last field/row
  row.push(current);
  if (row.some((v) => v.trim())) rows.push(row);

  return rows;
}

function mapRow(raw: Record<string, string>): Omit<DbProject, "created_at"> | null {
  const id = raw["BUIDL ID"]?.trim();
  const name = raw["BUIDL name"]?.trim();
  if (!id || !name) return null;

  const mapped: Partial<Omit<DbProject, "created_at">> = { id, name };
  for (const [col, field] of Object.entries(COL_MAP)) {
    if (field === "id" || field === "name") continue;
    const val = raw[col]?.trim() || null;
    if (field === "submission_time" || field === "last_updated") {
      const d = val ? new Date(val) : null;
      (mapped as Record<string, unknown>)[field] = d && !isNaN(d.getTime()) ? d.toISOString() : null;
    } else {
      (mapped as Record<string, unknown>)[field] = val;
    }
  }
  // Normalize track: "Track 2: Stellar Genesis" → "Genesis", etc.
  if (mapped.track) {
    mapped.track = normalizeTrack(mapped.track as string);
  }
  return mapped as Omit<DbProject, "created_at">;
}

type ImportResult = { imported: number; skipped: number; errors: string[] };

export default function CsvImportView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<Omit<DbProject, "created_at">[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setResult(null);
    setParseError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rawRows = parseCSV(text);
        const mapped: Omit<DbProject, "created_at">[] = [];
        const errors: string[] = [];

        rawRows.forEach((row, i) => {
          const m = mapRow(row);
          if (m) {
            mapped.push(m);
          } else {
            errors.push(`Row ${i + 2}: missing BUIDL ID or name`);
          }
        });

        if (mapped.length === 0) {
          setParseError("No valid rows found. Make sure the file uses standard DoraHacks CSV format.");
          return;
        }
        setPreview(mapped);
        if (errors.length > 0) {
          setParseError(`${errors.length} rows skipped: ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? "..." : ""}`);
        }
      } catch {
        setParseError("Failed to parse CSV. Make sure it's a valid UTF-8 CSV file.");
      }
    };
    reader.readAsText(file, "utf-8");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setImporting(true);
    try {
      const { inserted } = await upsertProjects(preview);
      setResult({ imported: inserted, skipped: preview.length - inserted, errors: [] });
      router.refresh();
      setPreview([]);
      setFileName(null);
    } catch (err) {
      setResult({ imported: 0, skipped: 0, errors: [String(err)] });
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setPreview([]);
    setResult(null);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-neon-purple/10 px-3 py-1 border border-neon-purple/20 mb-3">
          <span className="h-2 w-2 rounded-full bg-neon-purple" />
          <span className="text-[10px] font-oxanium tracking-widest text-neon-purple">ADMIN</span>
        </div>
        <h1 className="text-[26px] font-oxanium tracking-wider font-semibold text-black">
          Import Projects
        </h1>
        <p className="mt-1 text-[13px] font-oxanium tracking-wider text-black/50">
          Upload your DoraHacks CSV export to populate the projects list. Re-uploading is safe — existing entries will be updated.
        </p>
      </div>

      {/* Success result */}
      {result && (
        <div className={[
          "rounded-2xl border p-5 flex items-start gap-4",
          result.errors.length > 0
            ? "border-red-200 bg-red-50"
            : "border-green-200 bg-green-50",
        ].join(" ")}>
          {result.errors.length > 0 ? (
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          )}
          <div>
            {result.errors.length === 0 ? (
              <p className="text-[13px] font-oxanium tracking-wider font-semibold text-green-700">
                {result.imported} projects imported / updated successfully.
              </p>
            ) : (
              <p className="text-[13px] font-oxanium tracking-wider font-semibold text-red-700">
                Import failed: {result.errors[0]}
              </p>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-[11px] font-oxanium tracking-widest text-black/45 hover:text-black transition-colors"
            >
              IMPORT ANOTHER FILE
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!result && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={[
              "rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
              dragging
                ? "border-neon-cyan bg-neon-cyan/5"
                : fileName
                ? "border-black/20 bg-white"
                : "border-black/15 bg-white hover:border-neon-cyan/50 hover:bg-neon-cyan/[0.02]",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-3">
                <FileText className="h-10 w-10 text-neon-cyan" />
                <div className="text-[14px] font-oxanium tracking-wider font-semibold text-black">
                  {fileName}
                </div>
                <div className="text-[12px] font-oxanium tracking-widest text-black/45">
                  {preview.length} valid rows detected
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  className="flex items-center gap-1 text-[11px] font-oxanium tracking-widest text-black/40 hover:text-black transition-colors"
                >
                  <X className="h-3 w-3" /> REMOVE
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-10 w-10 text-black/25" />
                <div className="text-[14px] font-oxanium tracking-wider text-black/60">
                  Drag & drop your CSV here, or click to browse
                </div>
                <div className="text-[11px] font-oxanium tracking-widest text-black/35">
                  DORAHACKS EXPORT · .CSV FORMAT
                </div>
              </div>
            )}
          </div>

          {parseError && (
            <p className="text-[12px] font-oxanium tracking-wider text-amber-600">
              ⚠ {parseError}
            </p>
          )}

          {/* Preview table */}
          {preview.length > 0 && (
            <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
                <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black/70">
                  PREVIEW — {preview.length} PROJECTS
                </div>
              </div>
              <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/10 bg-black/[0.02]">
                      <th className="px-4 py-2.5 text-[10px] font-oxanium tracking-widest text-black/45">BUIDL ID</th>
                      <th className="px-4 py-2.5 text-[10px] font-oxanium tracking-widest text-black/45">NAME</th>
                      <th className="px-4 py-2.5 text-[10px] font-oxanium tracking-widest text-black/45">TRACK</th>
                      <th className="px-4 py-2.5 text-[10px] font-oxanium tracking-widest text-black/45">TEAM</th>
                      <th className="px-4 py-2.5 text-[10px] font-oxanium tracking-widest text-black/45">GITHUB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((p) => (
                      <tr key={p.id} className="border-b border-black/5 hover:bg-black/[0.01]">
                        <td className="px-4 py-2.5 text-[11px] font-oxanium tracking-wider text-black/50 max-w-[100px] truncate">{p.id}</td>
                        <td className="px-4 py-2.5 text-[12px] font-oxanium tracking-wider font-semibold text-black max-w-[180px] truncate">{p.name}</td>
                        <td className="px-4 py-2.5 text-[11px] font-oxanium tracking-wider text-neon-cyan">{p.track ?? "—"}</td>
                        <td className="px-4 py-2.5 text-[11px] font-oxanium tracking-wider text-black/50 max-w-[120px] truncate">{p.team_members ?? "—"}</td>
                        <td className="px-4 py-2.5 text-[11px] font-oxanium tracking-wider text-black/40 max-w-[120px] truncate">{p.github ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-black/10 flex justify-end">
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  variant="default"
                  className="min-w-[180px]"
                >
                  {importing ? "IMPORTING..." : `IMPORT ${preview.length} PROJECTS`}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Column mapping reference */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-[11px] font-oxanium tracking-widest font-semibold text-black/50 mb-3">
          EXPECTED COLUMNS (DORAHACKS FORMAT)
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          {Object.keys(COL_MAP).map((col) => (
            <div key={col} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/60 shrink-0" />
              <span className="text-[11px] font-oxanium tracking-wider text-black/55">{col}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
