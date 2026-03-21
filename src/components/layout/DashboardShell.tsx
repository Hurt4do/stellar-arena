import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[color:var(--background)]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-3 sm:p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

