"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultsScreen from "@/components/ResultsScreen";
import Footer from "@/components/Footer";
import { queryToAnswers, answersToQuery } from "@/lib/resultsUrl";

// A real route so a finished quiz result is bookmarkable, shareable, and
// survives a refresh — the exact edit (room/aesthetic/material/budget/
// priority) round-trips through the URL's query params instead of only
// living in client state.
function ResultsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const answers = queryToAnswers(searchParams);

  return (
    <>
      <ResultsScreen
        answers={answers}
        onRestart={() => router.push("/")}
        onRetakeQuiz={() => {
          const qs = answersToQuery(answers);
          router.push(qs ? `/?${qs}` : "/");
        }}
      />
      <Footer />
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsPageInner />
    </Suspense>
  );
}
