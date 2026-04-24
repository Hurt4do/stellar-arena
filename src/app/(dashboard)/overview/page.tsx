export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import OverviewView from "@/features/overview/OverviewView";
import { COOKIE_TRACK } from "@/lib/auth";

export default function OverviewPage() {
  const rawTrack = cookies().get(COOKIE_TRACK)?.value ?? null;
  return <OverviewView currentTrack={rawTrack as "genesis" | "scale" | null} />;
}
