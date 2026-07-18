"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import ChatScreen from "@/components/ChatScreen";
import { questions } from "@/lib/quiz";
import { answersToQuery, queryToAnswers } from "@/lib/resultsUrl";

type Screen = "home" | "quiz" | "chat";

type HistoryState = {
  screen: Screen;
  currentQuestion: number;
  answers: Record<string, string>;
};

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<Screen>("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profileInjected, setProfileInjected] = useState(false);

  // Push a browser history entry on every screen/step change so the
  // browser's back button steps back through the quiz instead of leaving
  // the site (the quiz itself has no route of its own — it's client state
  // living at "/"; /results and /browse are real routes).
  const pushHistory = useCallback((state: HistoryState) => {
    if (typeof window !== "undefined") window.history.pushState(state, "");
  }, []);

  useEffect(() => {
    // Baseline entry for the initial screen, so the first back press from a
    // fresh page load restores "home" instead of skipping past it.
    window.history.replaceState({ screen: "home", currentQuestion: 0, answers: {} }, "");

    // "Retake quiz" from /results links back here with the previous answers
    // in the query string (e.g. /?room=Living+Room&material=...) so the
    // retake starts pre-filled instead of blank.
    const seeded = queryToAnswers(searchParams);
    if (Object.keys(seeded).length > 0) {
      setAnswers(seeded);
      setCurrentQuestion(0);
      setScreen("quiz");
      pushHistory({ screen: "quiz", currentQuestion: 0, answers: seeded });
    }

    function onPopState(e: PopStateEvent) {
      const s = e.state as HistoryState | null;
      setScreen(s?.screen || "home");
      setCurrentQuestion(s?.currentQuestion || 0);
      setAnswers(s?.answers || {});
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startQuiz() {
    // "Begin the Style Quiz" is the fresh-start entry point — always clears
    // any prior answers still sitting in state (e.g. from an earlier run
    // this session) so question 1 never opens with a stale option
    // pre-selected. Contrast with the seeded-retake flow above (triggered
    // by query params from /results' "Retake quiz" link), which
    // intentionally pre-fills answers — that path never calls startQuiz().
    setAnswers({});
    setCurrentQuestion(0);
    setScreen("quiz");
    pushHistory({ screen: "quiz", currentQuestion: 0, answers: {} });
  }

  function selectOption(id: string, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        pushHistory({ screen: "quiz", currentQuestion: nextQuestion, answers: next });
      } else {
        // Results is a real route so the finished edit is bookmarkable and
        // shareable — the answers travel as query params.
        router.push(`/results?${answersToQuery(next)}`);
      }
    }, 180);
  }

  function quizBack() {
    if (currentQuestion > 0) {
      const prev = currentQuestion - 1;
      setCurrentQuestion(prev);
      pushHistory({ screen: "quiz", currentQuestion: prev, answers });
    } else {
      setScreen("home");
      pushHistory({ screen: "home", currentQuestion: 0, answers });
    }
  }

  function jumpToQuestion(index: number) {
    if (index >= 0 && index < currentQuestion) {
      setCurrentQuestion(index);
      pushHistory({ screen: "quiz", currentQuestion: index, answers });
    }
  }

  function goToChat() {
    setScreen("chat");
    pushHistory({ screen: "chat", currentQuestion, answers });
  }

  function restart() {
    setAnswers({});
    setProfileInjected(false);
    setScreen("home");
    pushHistory({ screen: "home", currentQuestion: 0, answers: {} });
  }

  return (
    <>
      {screen === "home" && <HomeScreen onStart={startQuiz} />}
      {screen === "quiz" && (
        <QuizScreen
          currentQuestion={currentQuestion}
          answers={answers}
          onSelect={selectOption}
          onBack={quizBack}
          onJumpTo={jumpToQuestion}
          onLogoClick={restart}
        />
      )}
      {screen === "chat" && (
        <ChatScreen
          answers={answers}
          onHome={restart}
          autoInjectProfile={!profileInjected}
          onInjected={() => setProfileInjected(true)}
        />
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
