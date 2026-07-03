"use client";

import { useState } from "react";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultsScreen from "@/components/ResultsScreen";
import ChatScreen from "@/components/ChatScreen";
import { questions } from "@/lib/quiz";

type Screen = "home" | "quiz" | "results" | "chat";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profileInjected, setProfileInjected] = useState(false);

  function startQuiz() {
    setCurrentQuestion(0);
    setScreen("quiz");
  }

  function selectOption(id: string, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
      } else {
        setScreen("results");
      }
    }, 180);
  }

  function quizBack() {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
    else setScreen("home");
  }

  function goToChat() {
    setScreen("chat");
  }

  function restart() {
    setAnswers({});
    setProfileInjected(false);
    setScreen("home");
  }

  return (
    <>
      {screen === "home" && <HomeScreen onStart={startQuiz} />}
      {screen === "quiz" && (
        <QuizScreen currentQuestion={currentQuestion} answers={answers} onSelect={selectOption} onBack={quizBack} />
      )}
      {screen === "results" && (
        <ResultsScreen answers={answers} onRestart={restart} onRetakeQuiz={startQuiz} onContinueToChat={goToChat} />
      )}
      {screen === "chat" && (
        <ChatScreen
          answers={answers}
          onHome={() => setScreen("home")}
          autoInjectProfile={!profileInjected}
          onInjected={() => setProfileInjected(true)}
        />
      )}
    </>
  );
}
