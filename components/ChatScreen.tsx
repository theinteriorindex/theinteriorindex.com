"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What walnut coffee tables work for a japandi living room?",
  "How do I style a minimalist bedroom in oak and linen?",
  "What's the difference between wabi-sabi and japandi?",
  "Suggest a floor lamp for a neutral reading corner",
];

function renderContent(content: string) {
  const withBold = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  return { __html: withBold };
}

export default function ChatScreen({
  answers,
  onHome,
  autoInjectProfile,
  onInjected,
}: {
  answers: Record<string, string>;
  onHome: () => void;
  autoInjectProfile: boolean;
  onInjected: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to **The Interior Index**. I'm your material-based design concierge — here to help you find the right pieces for your space.<br><br>Tell me about your room. What material direction are you drawn to? What feeling do you want the space to have?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const injectedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profileContext =
    Object.keys(answers).length > 0
      ? `User profile from quiz: Room — ${answers.room || "not specified"}, Aesthetic — ${
          answers.aesthetic || "not specified"
        }, Material — ${answers.material || "not specified"}, Budget — ${
          answers.budget || "not specified"
        }, Priority — ${answers.priority || "not specified"}.`
      : "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    if (autoInjectProfile && Object.keys(answers).length > 0 && !injectedRef.current) {
      injectedRef.current = true;
      onInjected();
      const context = `Based on my style quiz: Room — ${answers.room}, Aesthetic — ${answers.aesthetic}, Material — ${answers.material}, Budget — ${answers.budget}, Priority — ${answers.priority}.`;
      send(context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoInjectProfile]);

  async function send(text: string) {
    if (!text.trim() || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, profileContext }),
      });
      const data = await res.json();
      const reply = res.ok ? data.text : "I'm having trouble connecting. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    send(text);
  }

  return (
    <div className="screen active">
      <header className="site-header">
        <div className="logo">
          The Interior <span>Index</span>
        </div>
        <button className="btn-secondary" onClick={onHome} style={{ fontSize: "0.65rem" }}>
          ← Home
        </button>
      </header>
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-profile">
            <div className="chat-profile-label">Your design concierge</div>
            <div className="chat-profile-name">The Index AI</div>
            <div className="chat-profile-desc">
              Curating minimalist home decor by material since 2026. Ask me anything about your space.
            </div>
          </div>
          <div className="chat-sidebar-section">
            <div className="chat-sidebar-label">Try asking</div>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-suggestion" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div className={`chat-message ${m.role === "user" ? "user" : ""}`} key={i}>
                <div className="chat-avatar">{m.role === "user" ? "Y" : "I"}</div>
                <div className="chat-bubble" dangerouslySetInnerHTML={renderContent(m.content)} />
              </div>
            ))}
            {isLoading && (
              <div className="chat-message">
                <div className="chat-avatar">I</div>
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Describe your space or ask a design question..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="chat-send" onClick={handleSend}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
