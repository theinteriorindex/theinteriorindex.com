"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SubscribeModal from "./SubscribeModal";

// The phone-only menu: a three-line mark on the left of the header, and a
// white sheet that slides in from the left over the page (Liz, 2026-08-27,
// ruevintage74 as the reference). Extracted out of HomeScreen once it had to
// appear on every header — Browse, Results, About and the legal pages carry
// the same lockup in the same spot, and three copies of a focus-trap-adjacent
// overlay is three places for them to drift apart.
//
// Two ways in:
//   <MobileMenu />                       — owns its own state and modal.
//                                          Use this in any static header.
//   <MobileMenuButton> + <MobileMenuPanel> — separate mount points, for
//                                          HomeScreen, whose nav bar is a
//                                          stacking context the panel must
//                                          not live inside (the bar fades to
//                                          opacity 0 past the hero, which
//                                          would take a nested panel with it).

type ButtonProps = {
  onClick: () => void;
};

export function MobileMenuButton({ onClick }: ButtonProps) {
  return (
    <button type="button" className="mm-btn" aria-label="Open menu" onClick={onClick}>
      <span />
      <span />
      <span />
    </button>
  );
}

type PanelProps = {
  open: boolean;
  onClose: () => void;
  // Called when "Subscribe" is chosen. The panel closes itself first; the
  // owner decides what opens — HomeScreen already had its own SubscribeModal
  // instance and passes that, the default MobileMenu below renders one.
  onSubscribe: () => void;
};

export function MobileMenuPanel({ open, onClose, onSubscribe }: PanelProps) {
  // A fixed full-height overlay: while it is open the page behind must not
  // scroll, or a swipe on the panel scrolls the page underneath and closing
  // the menu leaves you somewhere else entirely. Escape closes it too.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Kept mounted and moved with transform so it slides both ways; aria-hidden
  // and tabIndex -1 keep it off screen readers and out of the tab order while
  // it is parked off-screen.
  return (
    <>
      <div
        className={`mm-scrim${open ? " mm-scrim-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`mm-panel${open ? " mm-panel-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="mm-close"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
        >
          <span />
          <span />
        </button>
        <nav className="mm-nav">
          <Link className="mm-link" href="/about" tabIndex={open ? 0 : -1} onClick={onClose}>
            About
          </Link>
          <Link className="mm-link" href="/browse" tabIndex={open ? 0 : -1} onClick={onClose}>
            Shop Our Edit
          </Link>
          <button
            type="button"
            className="mm-link"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              onClose();
              onSubscribe();
            }}
          >
            Subscribe
          </button>
        </nav>
      </div>
    </>
  );
}

// Self-contained version for headers that sit in normal flow and create no
// stacking context of their own. Drop it inside the <header> — the button
// positions itself against that header (which needs position: relative), and
// the panel is position: fixed, so it escapes to the viewport from there.
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  return (
    <>
      <MobileMenuButton onClick={() => setOpen(true)} />
      <MobileMenuPanel
        open={open}
        onClose={() => setOpen(false)}
        onSubscribe={() => setSubscribeOpen(true)}
      />
      {subscribeOpen && (
        <SubscribeModal source="site_nav_mobile" onClose={() => setSubscribeOpen(false)} />
      )}
    </>
  );
}
