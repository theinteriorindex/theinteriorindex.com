"use client";

import { useEffect, useState } from "react";
import { getQuestions } from "@/lib/quiz";
import { getAvailablePriorityTitles } from "@/lib/catalogData";

type Props = {
  currentQuestion: number;
  answers: Record<string, string>;
  onSelect: (id: string, value: string) => void;
  onBack: () => void;
  onJumpTo: (index: number) => void;
  onLogoClick: () => void;
};

export default function QuizScreen({ currentQuestion, answers, onSelect, onBack, onJumpTo, onLogoClick }: Props) {
  // Once room and material are both picked, look up which priority pieces
  // actually have real inventory (at any price) for that combination today,
  // so step 4 (priority piece) never offers a category that's a dead end
  // for the chosen material — e.g. "A statement table" for Linen & Natural
  // Textiles, which has no coffee tables at all. Either answer missing (or
  // the lookup still loading) leaves every priority option visible.
  const [availablePriorityTitles, setAvailablePriorityTitles] = useState<Set<string> | null>(null);
  useEffect(() => {
    if (!answers.room || !answers.material) {
      setAvailablePriorityTitles(null);
      return;
    }
    let cancelled = false;
    getAvailablePriorityTitles(answers.room, answers.material).then((set) => {
      if (!cancelled) setAvailablePriorityTitles(set);
    });
    return () => {
      cancelled = true;
    };
  }, [answers.room, answers.material]);

  const questions = getQuestions(answers.room, answers.aesthetic, availablePriorityTitles);
  const q = questions[currentQuestion];
  const total = questions.length;
  const progress = (currentQuestion / total) * 100;

  return (
    <div className="screen active">
      <header className="site-header site-header--quiz">
        <button className="logo" onClick={onLogoClick}>
          The Interior <span>Index</span>
        </button>
        <button className="btn-secondary" onClick={onBack} style={{ fontSize: "0.65rem" }}>
          ← Back
        </button>
      </header>
      <div className="quiz-container">
        <div className="quiz-sidebar">
          <div className="quiz-sidebar-title">Your style profile</div>
          {questions.map((step, i) => {
            const state = i < currentQuestion ? "done" : i === currentQuestion ? "active" : "";
            const clickable = state === "done";
            return (
              <div
                className={`quiz-step-item ${state}`}
                key={step.id}
                onClick={clickable ? () => onJumpTo(i) : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") onJumpTo(i);
                      }
                    : undefined
                }
              >
                <div className="quiz-step-num">{i + 1}</div>
                <div>
                  <div className="quiz-step-label">
                    {["Room focus", "Aesthetic direction", "Material palette", "Priority piece", "Budget range"][i]}
                  </div>
                  <div className="quiz-step-answer">{answers[step.id] || ""}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="quiz-main">
          <div className="quiz-q-num">
            {q.num} of 0{total}
          </div>
          <div className="quiz-q-title">{q.title}</div>
          <div className="quiz-q-sub">{q.sub}</div>
          <div className="quiz-options">
            {q.options.map((opt) => (
              <button
                key={opt.title}
                className={`quiz-option ${answers[q.id] === opt.title ? "selected" : ""}`}
                onClick={() => onSelect(q.id, opt.title)}
              >
                <span className="quiz-option-title">{opt.title}</span>
                <span className="quiz-option-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="quiz-nav">
            <div className="quiz-progress">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
