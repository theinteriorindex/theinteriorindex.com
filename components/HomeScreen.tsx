"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SubscribeModal from "./SubscribeModal";

// ── Landing page imagery ──
// Both full-bleed photos are 2x Magnific upscales (precision/photo mode) of
// styled Storage shots, uploaded to the product-images bucket as sitephoto1
// (hero — Alessio Bench, 1168x1576) and sitephoto2 (band — August travertine
// table, 1792x2400). The 1x originals ("Alessio Bench01.png" / "August
// Rectangle...01.png") remain in Storage as product photos.
const HERO_IMAGE =
  "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/sitephoto1.png";
const BAND_IMAGE =
  "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/sitephoto2.png";

// The four edits shown on the rail and in the nav's hover panel. `material`
// must match the /browse page's ALL_MATERIALS values exactly (see
// BrowseEditsScreen) so the pinned links land pre-filtered — it is a data
// value, not display copy. `img` is the rail photo further down the page and
// `menuImg` the nav panel's, deliberately different shots of the same edit so
// the same four pictures do not appear twice on one screen.
// `label` is what a visitor actually reads. It used to differ from
// `material` for this edit — the page said "Chrome" while the catalog, the
// quiz and /browse all still said "Metal" — but that split was migrated away
// on 2026-07-28, so the two now agree everywhere.
const EDITS = [
  {
    name: "The Walnut Edit",
    label: "Walnut",
    sub: "Solid & veneered walnut",
    material: "Walnut",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Baggio%20Modern%20Fluted%20Electric%20Adjustable%20Standing%20Desk01.png",
    menuImg: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/0a336757-c3f7-4e47-8bfb-e7869673bcb3/7f2ffd80-59cf-46f6-8386-ce70e3896501.jpg",
  },
  {
    name: "The Stone Edit",
    label: "Stone",
    sub: "Travertine · Marble",
    material: "Stone",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Dario%20Round%20Stone%20Dining%20Table%20with%20Conical%20Pedestal%20Base01%20(1).png",
    menuImg: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Cava%20Fluted%20Round%20Beige%20Travertine%20Drum%20Side%20Table01.png",
  },
  {
    name: "The Natural Fibers Edit",
    label: "Natural Fibers",
    sub: "Rattan · Cane · Seagrass",
    material: "Natural Fibers",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Bali%20%26%20pari%20Sebalio%20Tortoise%20Natural%20Rattan%20Coffee%20Table%20with%20Open%20Shelf%2001.png",
    menuImg: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Alessio%20Bench01.png",
  },
  {
    name: "The Chrome Edit",
    label: "Chrome",
    sub: "Chrome · Steel",
    material: "Chrome",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Corbusier%20Basculant%20Sling%20Chair01.jpeg",
    menuImg: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Wassily%20Chair%20-%20Chrome%20Frame03.png",
  },
];

// Gentle once-only reveals (EyeSwoon-style stillness): elements with
// data-reveal get .lp-in the first time they enter the viewport and keep it
// — a single soft fade-up per element, no reversal, no scroll-linked
// trailing. The hidden initial state only exists while .lp-anim is set here
// at mount, so without JS (or with reduced motion) everything is simply
// visible.
function useRevealOnce(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("lp-in"));
      return;
    }
    root.classList.add("lp-anim");
    let pending = new Set(els);
    let ticking = false;
    function check() {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of Array.from(pending)) {
        if (el.getBoundingClientRect().top < vh * 0.88) {
          el.classList.add("lp-in");
          pending.delete(el);
        }
      }
    }
    function onScroll() {
      if (!ticking && pending.size > 0) {
        ticking = true;
        requestAnimationFrame(check);
      }
    }
    // Double-rAF so the hidden initial state paints before the first check —
    // otherwise above-the-fold elements reveal without their transition.
    requestAnimationFrame(() => requestAnimationFrame(check));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
    };
  }, [rootRef]);
}

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [editsOpen, setEditsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useRevealOnce(rootRef);

  // Escape closes the edits panel — the only way out for someone who opened
  // it by tabbing to the link rather than hovering.
  useEffect(() => {
    if (!editsOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editsOpen]);

  // EyeSwoon-style header: fixed, transparent while over the hero photo,
  // switching to a solid warm-white bar (dark text, small centered logo)
  // once the page scrolls past the hero. 0.25s linear, both directions.
  useEffect(() => {
    function onScroll() {
      setNavSolid(window.scrollY > window.innerHeight - 90);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="screen active lp" ref={rootRef}>
      {/* Full-bleed hero: image edge-to-edge, nav floating transparently
          over it, a small title lockup on the image (links to the featured
          edit), and an italic credit bottom-left. Load-in is a slow
          staggered fade (CSS animations) — after that, the hero is still. */}
      <section className="lp-hero">
        <img className="lp-hero-img" src={HERO_IMAGE} alt="Alessio Bench in honed travertine" />
        <div className="lp-hero-scrim" />
        <nav
          className={`lp-nav${navSolid ? " lp-nav-solid" : ""}${
            editsOpen ? " lp-nav-menuopen" : ""
          }`}
          onMouseLeave={() => setEditsOpen(false)}
        >
          <div className="lp-nav-tag">A material-based design concierge</div>
          <div className="lp-nav-logo">
            The Interior <em>Index</em>
          </div>
          <div className="lp-nav-links">
            <button className="lp-nav-link" onClick={onStart}>
              The Quiz
            </button>
            <Link
              className="lp-nav-link"
              href="/browse"
              onMouseEnter={() => setEditsOpen(true)}
              onFocus={() => setEditsOpen(true)}
              aria-expanded={editsOpen}
            >
              Shop Our Edit
            </Link>
            <button className="lp-nav-link" onClick={() => setSubscribeOpen(true)}>
              Join the Edit
            </button>
          </div>

          {/* Hovering "Shop Our Edit" drops a full-width panel of the four
              material edits under the bar. The panel lives inside .lp-nav so
              the nav's own onMouseLeave covers both — moving the cursor down
              into the panel never leaves the hover region. It stays mounted
              and is hidden with opacity/visibility rather than unmounted, so
              its four photos are already in cache the first time it opens.
              Hidden below 900px, where there is no hover and the link just
              navigates. */}
          <div className={`lp-menu${editsOpen ? " lp-menu-open" : ""}`} aria-hidden={!editsOpen}>
            <div className="lp-menu-grid">
              {EDITS.map((edit) => (
                <Link
                  key={edit.material}
                  className="lp-menu-card"
                  href={`/browse?material=${encodeURIComponent(edit.material)}`}
                  tabIndex={editsOpen ? 0 : -1}
                  onClick={() => setEditsOpen(false)}
                >
                  <div className="lp-menu-card-img">
                    <img src={edit.menuImg} alt="" />
                  </div>
                  <span>{edit.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="lp-hero-lockup">
          The Interior <em>Index</em>
        </div>
        <span className="lp-hero-credit">The Stone Edit — Alessio Bench, honed travertine</span>
      </section>

      <section className="lp-statement">
        <h1 className="lp-statement-title" data-reveal>
          Your space, <em>curated</em>
          <br />
          by material
        </h1>
        <p className="lp-statement-body" data-reveal style={{ transitionDelay: "0.15s" }}>
          Tell us how you want your space to feel. We&rsquo;ll identify your material palette, curate the right
          pieces, and connect you with finds that fit your aesthetic and your budget.
        </p>
        <button className="lp-cta" data-reveal style={{ transitionDelay: "0.3s" }} onClick={onStart}>
          Begin the style quiz
        </button>
      </section>

      <section className="lp-rail">
        <div className="lp-rail-head" data-reveal>
          <h2 className="lp-rail-title">Shop Our Edit</h2>
          <Link className="lp-link" href="/browse">
            Shop all
          </Link>
        </div>
        <div className="lp-rail-grid">
          {EDITS.map((edit, i) => (
            <Link
              key={edit.material}
              className="lp-rail-card"
              href={`/browse?material=${encodeURIComponent(edit.material)}`}
              data-reveal
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="lp-rail-card-img">
                <img src={edit.img} alt={edit.name} loading="lazy" />
              </div>
              <h3>{edit.name}</h3>
              <span>{edit.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lp-band">
        <img className="lp-band-img" src={BAND_IMAGE} alt="August travertine dining table" loading="lazy" />
        <div className="lp-band-overlay">
          <div className="lp-band-eyebrow" data-reveal>
            The complete index
          </div>
          <h2 className="lp-band-title" data-reveal style={{ transitionDelay: "0.15s" }}>
            Shop the collection
          </h2>
          <Link className="lp-band-link" href="/browse" data-reveal style={{ transitionDelay: "0.3s" }}>
            View all pieces
          </Link>
        </div>
      </section>

      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} />}
    </div>
  );
}
