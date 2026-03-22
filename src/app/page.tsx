import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRoleFromCookies, homeForRole } from "@/lib/auth";

export default function RootPage() {
  const role = getRoleFromCookies(cookies());
  if (!role) redirect("/login");
  redirect(homeForRole(role));
}
