"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-[11px] font-oxanium tracking-widest text-black/40 hover:text-black/70 transition-colors"
    >
      <LogOut className="h-3 w-3" />
      LOGOUT
    </button>
  );
}
