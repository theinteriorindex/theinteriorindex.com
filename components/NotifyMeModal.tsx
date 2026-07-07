"use client";

import { useState } from "react";

type Props = {
  material: string;
  onClose: () => void;
};

type Status = "idle" | "sending" | "sent" | "error";

// Shown when someone picks a material on the Browse Edits page that has no
// live catalog yet (Marble, Linen). Captures their email via /api/notify-me,
// which saves it to Supabase (edit_waitlist) and sends a confirmation.
export default function NotifyMeModal({ material, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, material }),
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
            <div className="email-modal-eyebrow">You&rsquo;re on the list</div>
            <div className="email-modal-title">We&rsquo;ll let you know</div>
            <div className="email-modal-body">
              The {material} Edit is still being curated. We&rsquo;ll email {email} the moment it launches.
            </div>
          </>
        ) : (
          <>
            <div className="email-modal-eyebrow">Coming soon</div>
            <div className="email-modal-title">The {material} Edit isn&rsquo;t live yet</div>
            <div className="email-modal-body">
              We&rsquo;re still curating this one. Leave your email and we&rsquo;ll let you know the moment it
              launches.
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
                {status === "sending" ? "Saving…" : "Notify Me"}
              </button>
            </form>
            {status === "error" && <div className="email-modal-error">{errorMsg}</div>}
          </>
        )}
      </div>
    </div>
  );
}
