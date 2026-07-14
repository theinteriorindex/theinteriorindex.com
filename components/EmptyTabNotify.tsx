"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// Inline "coming soon" state for a results-page tab with no matching
// products yet (e.g. Walnut + Bedroom, before real Walnut bedroom inventory
// exists, or Home Office Seating before real desk chairs are sourced).
// Reuses the same /api/notify-me + edit_waitlist plumbing as NotifyMeModal,
// just rendered inline in the product grid instead of as a blocking modal.
export default function EmptyTabNotify({ label }: { label: string }) {
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
        body: JSON.stringify({ email, material: label }),
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
    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem" }}>
      {status === "sent" ? (
        <div style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-light)" }}>
          You&rsquo;re on the list — we&rsquo;ll email {email} the moment this edit is ready.
        </div>
      ) : (
        <>
          <div style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-light)", marginBottom: "1rem" }}>
            This edit is still being curated. Leave your email and we&rsquo;ll let you know the moment it&rsquo;s
            ready.
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}
          >
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
  );
}
