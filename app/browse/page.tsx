"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import BrowseEditsScreen from "@/components/BrowseEditsScreen";

// A real route (not client-only screen state) so this page is bookmarkable
// and shareable on its own, and reloading it doesn't lose your place.
// Suspense is required here because BrowseEditsScreen reads useSearchParams()
// (to support pinned links like /browse?material=Oak).
export default function BrowsePage() {
  const router = useRouter();
  return (
    <Suspense fallback={null}>
      <BrowseEditsScreen onBack={() => router.back()} onHome={() => router.push("/")} />
    </Suspense>
  );
}
