"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/app/public/BAF1.png";
import { User2, Gavel, ShieldCheck, ChevronLeft, Eye, EyeOff } from "lucide-react";
import type { Role } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [track, setTrack] = useState<"genesis" | "scale" | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function callAuth(selectedTrack?: "genesis" | "scale") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          passcode,
          name,
          track: selectedTrack ?? track ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return false;
      }
      return true;
    } catch {
      setError("Network error. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleSelect(r: Role) {
    setRole(r);
    setError("");
    if (r === "builder") {
      setLoading(true);
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "builder", passcode: "", name: "", track: "" }),
      });
      setLoading(false);
      if (res.ok) {
        router.push(from && from !== "/login" ? from : "/leaderboard");
      } else {
        setError("Login failed. Try again.");
      }
      return;
    }
    setStep(1);
  }

  async function handleCredentials() {
    if (!role) return;
    if (!passcode.trim()) { setError("Passcode is required"); return; }
    if (role === "mentor" && !name.trim()) { setError("Name is required"); return; }

    if (role === "admin") {
      const ok = await callAuth();
      if (ok) router.push(from && from !== "/login" ? from : "/overview");
      return;
    }
    // mentor → go to track selection
    setError("");
    setStep(2);
  }

  async function handleTrackSelect(t: "genesis" | "scale") {
    setTrack(t);
    const ok = await callAuth(t);
    if (ok) router.push(from && from !== "/login" ? from : "/overview");
  }

  const totalSteps = role === "mentor" ? 3 : role === "admin" ? 2 : 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f0f5ff 0%, #e8f0ff 50%, #f5f0ff 100%)" }}>
      {/* Background glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00B3D4, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #B35CFF, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur-sm shadow-[0_40px_100px_rgba(2,6,23,0.12)] p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-black/10 shadow-[0_0_20px_rgba(0,179,212,0.2)] overflow-hidden shrink-0">
              <Image src={logo} alt="Stellar Arena" width={40} height={40} className="h-10 w-10 object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-oxanium tracking-widest text-black/45 uppercase">Stellar Arena</div>
              <div className="text-[15px] font-oxanium tracking-wide font-semibold text-black">
                {step === 0 && "Select your role"}
                {step === 1 && "Enter credentials"}
                {step === 2 && "Select your track"}
              </div>
            </div>
          </div>

          {/* Step dots (for mentor) */}
          {role && role !== "builder" && (
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i <= step ? "24px" : "8px",
                    background: i <= step ? "#00B3D4" : "rgba(0,0,0,0.12)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={() => { setStep(s => s - 1); setError(""); }}
              className="flex items-center gap-1 text-[11px] font-oxanium tracking-widest text-black/45 hover:text-black/70 transition-colors mb-4"
            >
              <ChevronLeft className="h-3 w-3" /> BACK
            </button>
          )}

          {/* Step 0 — Role selection */}
          {step === 0 && (
            <div className="space-y-3">
              {([
                { r: "builder" as Role, Icon: User2, label: "BUILDER", desc: "View live leaderboard" },
                { r: "mentor" as Role, Icon: Gavel, label: "MENTOR", desc: "Evaluate & score projects" },
                { r: "admin" as Role, Icon: ShieldCheck, label: "ADMIN", desc: "Full access + CSV import" },
              ] as const).map(({ r, Icon, label, desc }) => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  disabled={loading}
                  className="w-full flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 text-left transition-all hover:border-[#00B3D4]/50 hover:bg-[#00B3D4]/5 hover:shadow-[0_0_20px_rgba(0,179,212,0.12)] disabled:opacity-50"
                >
                  <div className="h-9 w-9 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-black/60" />
                  </div>
                  <div>
                    <div className="text-[12px] font-oxanium tracking-widest font-semibold text-black">{label}</div>
                    <div className="text-[11px] font-oxanium tracking-wide text-black/45 mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
              {loading && (
                <div className="text-center text-[11px] font-oxanium tracking-widest text-black/40 pt-2">
                  AUTHENTICATING...
                </div>
              )}
            </div>
          )}

          {/* Step 1 — Credentials */}
          {step === 1 && (
            <div className="space-y-4">
              {role === "mentor" && (
                <div>
                  <label className="block text-[11px] font-oxanium tracking-widest text-black/55 mb-1.5 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[13px] font-oxanium tracking-wide text-black placeholder:text-black/30 outline-none focus:border-[#00B3D4]/60 focus:shadow-[0_0_0_3px_rgba(0,179,212,0.1)] transition-all"
                    onKeyDown={e => e.key === "Enter" && handleCredentials()}
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-oxanium tracking-widest text-black/55 mb-1.5 uppercase">Passcode</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pr-10 text-[13px] font-oxanium tracking-wide text-black placeholder:text-black/30 outline-none focus:border-[#00B3D4]/60 focus:shadow-[0_0_0_3px_rgba(0,179,212,0.1)] transition-all"
                    onKeyDown={e => e.key === "Enter" && handleCredentials()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/35 hover:text-black/60"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[11px] font-oxanium tracking-wider text-red-500">{error}</p>
              )}

              <button
                onClick={handleCredentials}
                disabled={loading}
                className="w-full rounded-xl py-3 text-[12px] font-oxanium tracking-widest font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: loading ? "#00B3D4aa" : "#00B3D4", boxShadow: "0 0 20px rgba(0,179,212,0.3)" }}
              >
                {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
              </button>
            </div>
          )}

          {/* Step 2 — Track selection (mentor only) */}
          {step === 2 && (
            <div className="space-y-3">
              {error && (
                <p className="text-[11px] font-oxanium tracking-wider text-red-500 mb-2">{error}</p>
              )}
              {([
                { t: "genesis" as const, label: "GENESIS TRACK", desc: "Early-stage projects · 10 min/team · 3 rooms" },
                { t: "scale" as const, label: "SCALE TRACK", desc: "Advanced teams · 22 min/team · Shark Tank format" },
              ]).map(({ t, label, desc }) => (
                <button
                  key={t}
                  onClick={() => handleTrackSelect(t)}
                  disabled={loading}
                  className="w-full flex flex-col gap-1 rounded-xl border border-black/10 bg-white p-5 text-left transition-all hover:border-[#00B3D4]/50 hover:bg-[#00B3D4]/5 hover:shadow-[0_0_20px_rgba(0,179,212,0.12)] disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#00B3D4]" />
                    <span className="text-[12px] font-oxanium tracking-widest font-semibold text-black">{label}</span>
                  </div>
                  <p className="text-[11px] font-oxanium tracking-wide text-black/45 pl-4">{desc}</p>
                </button>
              ))}
              {loading && (
                <div className="text-center text-[11px] font-oxanium tracking-widest text-black/40 pt-1">
                  LOGGING IN...
                </div>
              )}
            </div>
          )}

        </div>

        <p className="text-center text-[10px] font-oxanium tracking-widest text-black/30 mt-6">
          HACK+ ALEBRIJE · STELLAR BLOCKCHAIN HACKATHON · MEXICO CITY 2026
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
