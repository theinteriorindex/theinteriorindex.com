"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultsScreen from "@/components/ResultsScreen";
import ChatScreen from "@/components/ChatScreen";
import { questions } from "@/lib/quiz";

type Screen = "home" | "quiz" | "results" | "chat";

type HistoryState = {
  screen: Screen;
  currentQuestion: number;
  answers: Record<string, string>;
};

export default function Page() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profileInjected, setProfileInjected] = useState(false);

  // Push a browser history entry on every screen/step change so the
  // browser's back button steps back through the quiz instead of leaving
  // the site (the app has no routes of its own — it's all client state).
  const pushHistory = useCallback((state: HistoryState) => {
    if (typeof window !== "undefined") window.history.pushState(state, "");
  }, []);

  useEffect(() => {
    // Baseline entry for the initial screen, so the first back press from a
    // fresh page load restores "home" instead of skipping past it.
    window.history.replaceState({ screen: "home", currentQuestion: 0, answers: {} }, "");

    function onPopState(e: PopStateEvent) {
      const s = e.state as HistoryState | null;
      setScreen(s?.screen || "home");
      setCurrentQuestion(s?.currentQuestion || 0);
      setAnswers(s?.answers || {});
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function startQuiz() {
    setCurrentQuestion(0);
    setScreen("quiz");
    pushHistory({ screen: "quiz", currentQuestion: 0, answers });
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
        setScreen("results");
        pushHistory({ screen: "results", currentQuestion, answers: next });
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

  function goToBrowse() {
    // Browse Our Edit is a real route (not client-only screen state) so it's
    // bookmarkable and shareable on its own.
    router.push("/browse");
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
      {screen === "results" && (
        <ResultsScreen answers={answers} onRestart={restart} onRetakeQuiz={startQuiz} onBrowseEdits={goToBrowse} />
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
