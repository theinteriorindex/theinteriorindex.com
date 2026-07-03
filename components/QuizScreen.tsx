"use client";

import { questions } from "@/lib/quiz";

type Props = {
  currentQuestion: number;
  answers: Record<string, string>;
  onSelect: (id: string, value: string) => void;
  onBack: () => void;
};

export default function QuizScreen({ currentQuestion, answers, onSelect, onBack }: Props) {
  const q = questions[currentQuestion];
  const total = questions.length;
  const progress = (currentQuestion / total) * 100;

  return (
    <div className="screen active">
      <header className="site-header">
        <div className="logo">
          The Interior <span>Index</span>
        </div>
        <button className="btn-secondary" onClick={onBack} style={{ fontSize: "0.65rem" }}>
          ← Back
        </button>
      </header>
      <div className="quiz-container">
        <div className="quiz-sidebar">
          <div className="quiz-sidebar-title">Your style profile</div>
          {questions.map((step, i) => {
            const state = i < currentQuestion ? "done" : i === currentQuestion ? "active" : "";
            return (
              <div className={`quiz-step-item ${state}`} key={step.id}>
                <div className="quiz-step-num">{i + 1}</div>
                <div>
                  <div className="quiz-step-label">
                    {["Room focus", "Aesthetic direction", "Material palette", "Budget range", "Priority piece"][i]}
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
