import type { ReactNode } from "react";
import { cookies } from "next/headers";
import DashboardShell from "@/components/layout/DashboardShell";
import { getRoleFromCookies, COOKIE_NAME, COOKIE_TRACK } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const role = getRoleFromCookies(cookieStore) ?? "builder";
  const rawName = cookieStore.get(COOKIE_NAME)?.value ?? "";
  const judgeName = rawName ? decodeURIComponent(rawName) : null;
  const track = (cookieStore.get(COOKIE_TRACK)?.value as "genesis" | "scale" | "") || null;

  return (
    <DashboardShell role={role} judgeName={judgeName} track={track}>
      {children}
    </DashboardShell>
  );
}
