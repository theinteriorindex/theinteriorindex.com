"use client";

import { useEffect, useState } from "react";
import type { ProductGroup } from "@/lib/catalog";

type Props = {
  editLabel: string;
  orderedTabs: string[];
  products: ProductGroup;
};

type Status = "idle" | "sending" | "sent" | "error";

// Auto-opens once per browser session when the results page lands with a
// populated edit, offering to email the curated list (first/hero tab plus
// every other tab, same order as the on-page tabs) via /api/send-list.
export default function EmailListModal({ editLabel, orderedTabs, products }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || orderedTabs.length === 0) return;
    if (sessionStorage.getItem("tii_email_prompt_shown")) return;
    sessionStorage.setItem("tii_email_prompt_shown", "1");
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [orderedTabs.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/send-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, editLabel, orderedTabs, products }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setTimeout(() => setOpen(false), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!open) return null;

  const restTabs = orderedTabs.slice(1);

  return (
    <div className="email-modal-overlay" onClick={() => setOpen(false)}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <button className="email-modal-close" onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
        {status === "sent" ? (
          <>
            <div className="email-modal-eyebrow">Sent</div>
            <div className="email-modal-title">Check your inbox</div>
            <div className="email-modal-body">
              Your {editLabel} is on its way to {email}.
            </div>
          </>
        ) : (
          <>
            <div className="email-modal-eyebrow">Save this edit</div>
            <div className="email-modal-title">Get your curated list by email</div>
            <div className="email-modal-body">
              We&rsquo;ll send your {editLabel} — {orderedTabs[0]}
              {restTabs.length > 0 ? ` to start, plus ${restTabs.join(", ")}` : ""} — so you can shop it later.
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
                {status === "sending" ? "Sending…" : "Send My List"}
              </button>
            </form>
            {status === "error" && <div className="email-modal-error">{errorMsg}</div>}
            <button className="email-modal-dismiss" onClick={() => setOpen(false)}>
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
