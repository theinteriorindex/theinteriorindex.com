"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SubscribeModal from "./SubscribeModal";

// ── Landing page imagery ──
// Both hero images were 2x-upscaled via Magnific (precision/photo mode).
// Until the upscaled files are uploaded to Supabase Storage, these point at
// the original 1x Storage files — swap the filenames below once the @2x
// versions land in the product-images bucket (they'll render soft at
// full-bleed sizes until then).
const HERO_IMAGE =
  "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Alessio%20Bench01.png";
const BAND_IMAGE =
  "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/August%20Rectangle%20Travertine%20Dining%20Table%20with%20Block%20Legs01.png";

// The four edits shown on the rail. `material` must match the /browse page's
// ALL_MATERIALS values exactly (see BrowseEditsScreen) so the pinned links
// land pre-filtered.
const EDITS = [
  {
    name: "The Walnut Edit",
    sub: "Solid & veneered walnut",
    material: "Walnut",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Baggio%20Modern%20Fluted%20Electric%20Adjustable%20Standing%20Desk01.png",
  },
  {
    name: "The Stone Edit",
    sub: "Travertine · Marble",
    material: "Stone",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Dario%20Round%20Stone%20Dining%20Table%20with%20Conical%20Pedestal%20Base01%20(1).png",
  },
  {
    name: "The Natural Fibers Edit",
    sub: "Rattan · Cane · Seagrass",
    material: "Natural Fibers",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Bali%20%26%20pari%20Sebalio%20Tortoise%20Natural%20Rattan%20Coffee%20Table%20with%20Open%20Shelf%2001.png",
  },
  {
    name: "The Metal Edit",
    sub: "Chrome · Steel",
    material: "Metal",
    img: "https://khtustdchmvurrsmcdbb.supabase.co/storage/v1/object/public/product-images/Corbusier%20Basculant%20Sling%20Chair01.jpeg",
  },
];

// Reveal-on-scroll: any element carrying data-reveal starts hidden (see the
// .lp [data-reveal] rules in globals.css) and gets .lp-revealed once ~15% of
// it enters the viewport. Elements are unobserved after revealing — the
// animation plays once, no re-trigger on scroll-up, which keeps the page
// calm. prefers-reduced-motion users skip the whole thing (everything is
// revealed immediately, and the CSS also zeroes the transitions).
function useScrollReveal(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("lp-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}

// Soft parallax on the two full-bleed images: each frame is overflow:hidden
// with the image sized ~112% tall, and scroll position nudges the image
// within the frame via a CSS variable (--lp-parallax). rAF-throttled, and
// skipped entirely under prefers-reduced-motion.
function useParallax(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (frames.length === 0) return;
    let ticking = false;
    function update() {
      ticking = false;
      const vh = window.innerHeight;
      for (const frame of frames) {
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue;
        // -1 (frame just entered from bottom) → 1 (about to leave off top)
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        frame.style.setProperty("--lp-parallax", `${(-progress * 4).toFixed(2)}%`);
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef]);
}

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useScrollReveal(rootRef);
  useParallax(rootRef);

  return (
    <div className="screen active lp" ref={rootRef}>
      <nav className="lp-nav">
        <div className="logo">
          The Interior <span>Index</span>
        </div>
        <div className="lp-nav-links">
          <button className="lp-nav-link" onClick={onStart}>
            The Quiz
          </button>
          <Link className="lp-nav-link" href="/browse">
            Shop Our Edit
          </Link>
          <button className="lp-nav-link" onClick={() => setSubscribeOpen(true)}>
            Join the Edit
          </button>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-frame" data-parallax>
          <img className="lp-hero-img" src={HERO_IMAGE} alt="Alessio Bench in honed travertine" />
        </div>
        <div className="lp-hero-caption">
          <span className="lp-caption-label">The Stone Edit — No. 04</span>
          <span className="lp-caption-credit">Alessio Bench, honed travertine</span>
        </div>
      </section>

      <section className="lp-statement">
        <h1 className="lp-statement-title" data-reveal>
          Your space, <em>curated</em>
          <br />
          by material
        </h1>
        <p className="lp-statement-body" data-reveal>
          Tell us how you want your space to feel. We&rsquo;ll identify your material palette, curate the right
          pieces, and connect you with finds that fit your aesthetic and your budget.
        </p>
        <button className="lp-cta" data-reveal onClick={onStart}>
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
              style={{ transitionDelay: `${i * 0.12}s` }}
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
        <div className="lp-band-frame" data-parallax>
          <img className="lp-band-img" src={BAND_IMAGE} alt="August travertine dining table" loading="lazy" />
        </div>
        <div className="lp-band-overlay">
          <div className="lp-band-eyebrow" data-reveal>
            The complete index
          </div>
          <h2 className="lp-band-title" data-reveal>
            Shop the collection
          </h2>
          <Link className="lp-band-link" href="/browse" data-reveal>
            View all pieces
          </Link>
        </div>
      </section>

      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} />}
    </div>
  );
}
