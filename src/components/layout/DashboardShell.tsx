import type { ReactNode } from "react";
import type { Role } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface Props {
  children: ReactNode;
  role: Role;
  judgeName: string | null;
  track: "genesis" | "scale" | null;
}

export default function DashboardShell({ children, role, judgeName, track }: Props) {
  return (
    <div className="min-h-screen flex bg-[color:var(--background)]">
      <Sidebar role={role} judgeName={judgeName} track={track} />
      <div className="flex-1 min-w-0">
        <Topbar role={role} judgeName={judgeName} track={track} />
        <main className="p-3 sm:p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
