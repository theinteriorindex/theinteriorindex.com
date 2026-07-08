"use client";

import { useRouter } from "next/navigation";
import BrowseEditsScreen from "@/components/BrowseEditsScreen";

// A real route (not client-only screen state) so this page is bookmarkable
// and shareable on its own, and reloading it doesn't lose your place.
export default function BrowsePage() {
  const router = useRouter();
  return <BrowseEditsScreen onBack={() => router.back()} onHome={() => router.push("/")} />;
}
