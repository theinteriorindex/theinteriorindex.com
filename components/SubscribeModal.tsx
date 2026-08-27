"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  // Which surface opened this, recorded on the subscriber row. Defaults to
  // the original Browse/Results value so those two callers are unchanged;
  // the landing page's mobile nav drawer passes its own.
  source?: string;
};

type Status = "idle" | "sending" | "sent" | "error";

// Opened by SubscribeButton. Generic newsletter capture via /api/subscribe
// (public.newsletter_subscribers) — reuses the same email-modal-* styling
// as NotifyMeModal/EmailListModal so it reads as the same design system,
// not a bolted-on third pattern.
export default function SubscribeModal({ onClose, source = "browse_corner_button" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <button className="email-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {status === "sent" ? (
          <>
            <div className="email-modal-eyebrow">You&rsquo;re in</div>
            <div className="email-modal-title">Welcome to the Edit</div>
            <div className="email-modal-body">
              New material edits, curated finds, and the occasional round-up — sent to {email}.
            </div>
          </>
        ) : (
          <>
            <div className="email-modal-eyebrow">Stay in the loop</div>
            <div className="email-modal-title">Join the Edit</div>
            <div className="email-modal-body">
              New material edits, curated finds, and the occasional round-up. No spam, unsubscribe anytime.
            </div>
            <form className="email-modal-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-modal-input"
              />
              <button type="submit" className="btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Joining…" : "Join"}
              </button>
            </form>
            {status === "error" && <div className="email-modal-error">{errorMsg}</div>}
          </>
        )}
      </div>
    </div>
  );
}
