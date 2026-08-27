"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SubscribeModal from "./SubscribeModal";
import { MobileMenuButton, MobileMenuPanel } from "./MobileMenu";

// ── Landing page imagery ──
// The hero is now a 3.1s video loop (Liz's generated house-in-jungle scene,
// 2026-08-04) — transcoded from the 130MB ProRes master (site/landing
// page/03.mov, kept as source of truth) to a 2.2MB 1920px H.264 with a
// poster frame, both served as static assets from /public/landing/. Under
// prefers-reduced-motion the video is hidden and the poster shows instead
// (see globals.css). The old Alessio Bench hero photo (Storage sitephoto1)
// is no longer referenced but remains in Storage.
// The band photo is a 2x Magnific upscale of a styled Storage shot,
// uploaded to the product-images bucket as sitephoto2 (August travertine
// table, 1792x2400).
// The lights-on moment (2026-08-04, Liz's 04_lightson.mov): the hero
// plays a one-shot intro — the dark house holds for 1.3s, then the
// interior lights ramp up over 0.8s (a crossfade between the two
// pixel-aligned masters, which reads as the lights coming on), timed so
// the ramp starts exactly as the CTA fades in (its 1.3s stagger delay).
// On ended, playback hands off to a seamless ambient loop of the lit
// state (rain and foliage only); the loop file is the lit master
// rotated to start at the intro's exit frame, so the two match at the
// seam. The moment plays once per visit — looping a light turning on
// would read as a fault, not an arrival.
const HERO_INTRO = "/landing/hero-intro-1920.mp4"; // dark → lit, plays once
const HERO_LOOP = "/landing/hero-loop-1920.mp4"; // lit ambient, loops
const HERO_POSTER = "/landing/hero-03-poster.jpg"; // dark — matches intro start
const HERO_POSTER_LIT = "/landing/hero-04-poster.jpg"; // lit — reduced-motion still
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
const MENU_EDITS = [
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

// The four tiles in the front-page "Shop Our Edit" rail. Deliberately a
// SEPARATE list from MENU_EDITS above: the nav hover panel still shows the
// original Walnut / Stone / Natural Fibers / Chrome set, and only this rail
// was re-cut to Light / Oak / Natural Fibers / Chrome (Liz, 2026-08-27).
// Change one without changing the other.
//
// `material` must match /browse's ALL_MATERIALS exactly — it is a data value,
// not display copy. "Lighting" is a valid chip there even though no product
// row stores it as a material: lighting rows have material NULL and
// fetchBrowseRows stamps the synthetic "Lighting" label onto every
// category="Lighting" row.
//
// These are the product shots Liz picked, so they point at the same source
// CDNs the product cards use (vetro.dk, cdn.shopify.com, 1stdibscdn) rather
// than our own Supabase Storage bucket. If a merchant rotates one of these
// URLs the tile goes blank — worth re-hosting into product-images.
const RAIL_EDITS = [
  {
    // Murano Candy Floor Lamp, Yellow/White Swirl (Vetro) — the lit shot on
    // the black plinth, not the white-background pack shot.
    name: "The Light Edit",
    label: "Lighting",
    sub: "Lamps · Pendants · Sconces",
    material: "Lighting",
    img: "https://vetro.dk/cdn/shop/files/5E6DF8A3-ECF1-48B9-903A-38B066C05B53.jpg?v=1764270221",
  },
  {
    // Santa Fe Modern Dresser (Bertu Home). Phrasing mirrors the Walnut
    // edit's "Solid & veneered walnut". Note the Oak bucket is an edit
    // bucket rather than a species claim — it also carries ash, acacia,
    // teak and maple (this dresser is maple) — so keep this label out of
    // per-product copy, where a species claim has to be accurate.
    name: "The Oak Edit",
    label: "Oak",
    sub: "Solid & veneered oak",
    material: "Oak",
    img: "https://cdn.shopify.com/s/files/1/1504/9526/files/Santa-Fe-Modern-Dresser-01.jpg?v=1738696474",
  },
  {
    // R&Y Augousti rattan nesting side table, blue.
    name: "The Natural Fibers Edit",
    label: "Natural Fibers",
    sub: "Rattan · Cane · Seagrass",
    material: "Natural Fibers",
    img: "https://a.1stdibscdn.com/rattan-nesting-side-table-with-shell-and-brass-inlay-by-ry-augousti-for-sale-picture-2/f_45491/f_320769721672969972501/NT20_BLUE_7__master.jpg",
  },
  {
    // Fleur Studios SS-DIN03BR stainless dining table, in situ.
    name: "The Chrome Edit",
    label: "Chrome",
    sub: "Chrome · Steel",
    material: "Chrome",
    img: "https://cdn.shopify.com/s/files/1/0295/8029/6330/files/SS-DIN03BR120nodiskedit.jpg",
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

type JoinStatus = "idle" | "sending" | "sent" | "error";

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  const [navSolid, setNavSolid] = useState(false);
  // Lights-on hero: the one-shot intro hides itself on ended, revealing
  // the ambient loop underneath (see the hero markup below).
  const [heroIntroDone, setHeroIntroDone] = useState(false);
  // iOS refuses to autoplay in Low Power Mode (and some data-saver / older
  // device cases). Safari's answer is to draw a big play button over the
  // poster, which is not a hero — it reads as a broken embed. Detect the
  // rejection and fall back to the same still frame prefers-reduced-motion
  // already uses, so the failure state is a photograph, not a control.
  const heroIntroRef = useRef<HTMLVideoElement | null>(null);
  const [heroVideoBlocked, setHeroVideoBlocked] = useState(false);
  useEffect(() => {
    const el = heroIntroRef.current;
    if (!el) return;
    // autoPlay on the element covers the normal case; this only catches the
    // refusal. play() resolves a promise in every browser that matters.
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setHeroVideoBlocked(true));
    }
  }, []);
  const heroLoopRef = useRef<HTMLVideoElement | null>(null);
  // iOS Safari tints the status-bar/clock area from the theme-color
  // meta, NOT from the page background — so the forest chrome has to be
  // set here while the landing screen is mounted, and restored on
  // unmount (quiz/results keep their warm chrome). Liz, 2026-08-05.
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = "#0B140D";
    return () => {
      if (created) meta?.remove();
      else if (meta) meta.content = prev;
    };
  }, []);
  // Mobile-only nav. Below 900px the bar carries the lockup and a three-line
  // menu button instead of the tagline and links (Liz, 2026-08-27); this is
  // the drawer that button opens. Independent of editsOpen/joinOpen, which
  // are the desktop hover panels and stay display:none on a phone.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // "Subscribe" in the mobile drawer opens the shared SubscribeModal rather
  // than the .lp-join dropdown — a dropdown that grows a three-field form
  // inside a drawer fights the on-screen keyboard on a phone, and the modal
  // is the pattern Browse and Results already use.
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [editsOpen, setEditsOpen] = useState(false);
  // "Join the Edit" opens a dropdown panel under the bar (same surface as
  // the Shop Our Edit panel) with an inline subscribe form, instead of the
  // SubscribeModal overlay (which Results/Browse still use).
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinEmail, setJoinEmail] = useState("");
  const [joinFirst, setJoinFirst] = useState("");
  const [joinLast, setJoinLast] = useState("");
  const [joinStatus, setJoinStatus] = useState<JoinStatus>("idle");
  const [joinError, setJoinError] = useState("");
  // While the email field has focus, the panel ignores the nav's
  // onMouseLeave — typing with the cursor drifted off the bar must not
  // close the form mid-entry.
  const joinFocusRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useRevealOnce(rootRef);

  // Escape closes either panel — the only way out for someone who opened
  // one by tabbing to the link rather than hovering.
  useEffect(() => {
    if (!editsOpen && !joinOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setEditsOpen(false);
        setJoinOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editsOpen, joinOpen]);

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoinStatus("sending");
    setJoinError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: joinEmail,
          firstName: joinFirst,
          lastName: joinLast,
          source: "landing_nav_dropdown",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setJoinStatus("sent");
    } catch (err) {
      setJoinStatus("error");
      setJoinError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

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
      {/* Full-bleed hero: video loop edge-to-edge, nav floating
          transparently over it, and an italic credit bottom-left. The video
          is decorative (aria-hidden); the poster doubles as the
          reduced-motion still, toggled in CSS. Load-in is a slow staggered
          fade on the type only (CSS animations) — the video is simply
          there from the first frame, same no-load-fade rule as the photo
          it replaced. */}
      <section className={`lp-hero${heroVideoBlocked ? " lp-hero-still" : ""}`}>
        {/* Loop sits underneath, preloaded and paused; the intro plays on
            top and hides itself on ended, revealing the already-playing
            loop at the matching frame. If JS or autoplay fails, the intro
            freezes on its last frame — which equals the loop's first, so
            the failure state is just the still, lit house. */}
        <video
          ref={heroLoopRef}
          className="lp-hero-video"
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setHeroIntroDone(true)}
        >
          <source src={HERO_LOOP} type="video/mp4" />
        </video>
        <video
          ref={heroIntroRef}
          className={`lp-hero-video lp-hero-video-intro${heroIntroDone ? " lp-hero-video-hidden" : ""}`}
          autoPlay
          muted
          playsInline
          poster={HERO_POSTER}
          aria-hidden="true"
          onEnded={() => {
            // Do NOT hide the intro here — it stays frozen on its last
            // frame until the loop underneath fires onPlaying (i.e. is
            // actually rendering frames). Hiding synchronously opened a
            // gap where neither video had a frame, flashing the hero's
            // dark background + scrim (the "black gradient pop", flagged
            // by Liz 2026-08-04). The freeze and the loop's first frame
            // match, so the deferred handoff is invisible.
            heroLoopRef.current?.play();
          }}
        >
          <source src={HERO_INTRO} type="video/mp4" />
        </video>
        <img className="lp-hero-img" src={HERO_POSTER_LIT} alt="" aria-hidden="true" />
        {/* Scrim, top/bottom only and at roughly half its old strength
            (Liz, 2026-08-27: "not as dark, but still present"). The 90deg
            left-to-right veil that used to sit behind the headline is gone
            for good — that copy no longer exists. */}
        <div className="lp-hero-scrim" />
        <nav
          className={`lp-nav${navSolid ? " lp-nav-solid" : ""}${
            editsOpen || joinOpen ? " lp-nav-menuopen" : ""
          }`}
          onMouseLeave={() => {
            setEditsOpen(false);
            if (!joinFocusRef.current) setJoinOpen(false);
          }}
        >
          <div className="lp-nav-tag">A material-based design concierge</div>
          <div className="lp-nav-logo">
            The Interior <em>Index</em>
          </div>
          {/* No "The Quiz" link up here — the "Begin the style quiz" CTA
              sits centred on the hero right below (and the footer still
              carries a quiz link for every other page). */}
          <div className="lp-nav-links">
            {/* About sits left of Shop Our Edit. It closes both hover panels
                on enter — without that, sliding the cursor left off "Shop Our
                Edit" onto About leaves the edits panel hanging open under a
                link that has nothing to do with it. */}
            <Link
              className="lp-nav-link"
              href="/about"
              onMouseEnter={() => {
                setEditsOpen(false);
                setJoinOpen(false);
              }}
            >
              About
            </Link>
            <Link
              className="lp-nav-link"
              href="/browse"
              onMouseEnter={() => {
                setEditsOpen(true);
                if (!joinFocusRef.current) setJoinOpen(false);
              }}
              onFocus={() => setEditsOpen(true)}
              aria-expanded={editsOpen}
            >
              Shop Our Edit
            </Link>
            <button
              className="lp-nav-link"
              onMouseEnter={() => {
                setJoinOpen(true);
                setEditsOpen(false);
              }}
              onFocus={() => {
                setJoinOpen(true);
                setEditsOpen(false);
              }}
              onClick={() => setJoinOpen(true)}
              aria-expanded={joinOpen}
            >
              Subscribe
            </button>
          </div>

          {/* Mobile only (hidden above 900px), hung off the LEFT edge (Liz,
              2026-08-27) so it sits on the same side the panel slides in
              from. Shared with every other header — see components/MobileMenu.tsx. */}
          <MobileMenuButton onClick={() => setMobileNavOpen(true)} />

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
              {MENU_EDITS.map((edit) => (
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

          {/* Hovering "Join the Edit" drops a slim subscribe panel under
              the bar — same surface and same open/close mechanics as the
              edits panel above (lives inside .lp-nav so the nav's
              onMouseLeave covers it; stays mounted, hidden with
              opacity/visibility). Posts to the same /api/subscribe as
              SubscribeModal, which Results and Browse still use. Hidden
              below 900px along with the links. */}
          <div className={`lp-join${joinOpen ? " lp-join-open" : ""}`} aria-hidden={!joinOpen}>
            <div className="lp-join-inner">
              {joinStatus === "sent" ? (
                <>
                  <div className="lp-join-title">
                    Welcome to the Edit{joinFirst.trim() ? `, ${joinFirst.trim()}` : ""}
                  </div>
                  <p className="lp-join-body">
                    New material edits, curated finds, and the occasional round-up — sent to {joinEmail}.
                  </p>
                </>
              ) : (
                <>
                  {/* No "Join the Edit" heading — the nav link the cursor
                      is already on says it; the panel goes straight to the
                      pitch line and the form. */}
                  <p className="lp-join-body">
                    New material edits, curated finds, and the occasional round-up. No spam, unsubscribe
                    anytime.
                  </p>
                  <form className="lp-join-form" onSubmit={handleJoinSubmit}>
                    <div className="lp-join-row">
                      <input
                        type="text"
                        autoComplete="given-name"
                        placeholder="First name"
                        className="lp-join-input"
                        value={joinFirst}
                        onChange={(e) => setJoinFirst(e.target.value)}
                        onFocus={() => (joinFocusRef.current = true)}
                        onBlur={() => (joinFocusRef.current = false)}
                        tabIndex={joinOpen ? 0 : -1}
                      />
                      <input
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last name"
                        className="lp-join-input"
                        value={joinLast}
                        onChange={(e) => setJoinLast(e.target.value)}
                        onFocus={() => (joinFocusRef.current = true)}
                        onBlur={() => (joinFocusRef.current = false)}
                        tabIndex={joinOpen ? 0 : -1}
                      />
                    </div>
                    <div className="lp-join-row">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@email.com"
                        className="lp-join-input"
                        value={joinEmail}
                        onChange={(e) => setJoinEmail(e.target.value)}
                        onFocus={() => (joinFocusRef.current = true)}
                        onBlur={() => (joinFocusRef.current = false)}
                        tabIndex={joinOpen ? 0 : -1}
                      />
                      <button
                        type="submit"
                        className="lp-join-btn"
                        disabled={joinStatus === "sending"}
                        tabIndex={joinOpen ? 0 : -1}
                      >
                        {joinStatus === "sending" ? "Joining…" : "Join"}
                      </button>
                    </div>
                  </form>
                  {joinStatus === "error" && <div className="lp-join-error">{joinError}</div>}
                </>
              )}
            </div>
          </div>
        </nav>
        {/* The statement + quiz CTA sits centred on the hero now — same
            copy as ever, moved up from its own section below (2026-08-03,
            per Liz). The big title lockup that used to occupy this spot
            moved into the centre of the nav bar (.lp-nav-logo, always
            visible: cream over the photo, bark once the bar goes solid).
            Fades in with the hero's load stagger, like the lockup did —
            not a scroll reveal, it is above the fold. */}
        {/* Load-in: the two title lines, the body and the CTA rise in a
            slow soft stagger (lpRise), joining the hero's existing load
            sequence — once, on load, then still. Each line is its own
            span so the stagger can run per line. */}
        {/* The hero statement is now an about-manifesto (2026-08-04, per
            Liz — refs: TMD's "THE TMD WAY...", Sample House's about
            paragraph). The "Your space, curated by material" tagline is
            replaced by a kicker + the same body copy promoted to display
            treatment, with the quiz CTA as a solid white box. */}
        {/* The manifesto in the EyeSwoon headline register (2026-08-05,
            per Liz's references — Athena Calderone / EyeSwoon): a
            microscopic tracked label, then the claim as display serif in
            CAPS with lowercase italic words woven through mid-sentence
            (the roman caps are the architecture, the italics the human
            hand — "type treated like art"), then a small utility process
            block and the cream CTA. */}
        {/* No label — "About" removed per Liz (2026-08-05). */}
        <div className="lp-hero-statement">
          {/* Headline and process paragraph removed per Liz (2026-08-27):
              the hero now carries the CTA alone over the video. The button
              keeps its original 1.25s rise delay, so it still arrives on the
              same beat it did when it followed the copy. The
              .lp-statement-claim / .lp-statement-process styles are left in
              globals.css for any future hero that carries copy again, the
              same way .lp-hero-credit was kept. */}
          {/* No .lp-rise here on purpose (Liz, 2026-08-27): the CTA is on from
              the first frame rather than fading up behind the lights-on
              intro. To put the fade back, restore
              className="lp-cta lp-rise" style={{ animationDelay: "1.25s" }}.
              Without the class there is no animation at all, so the button
              renders at full opacity immediately — lpRise uses fill-mode
              `both`, which is what was holding it invisible until its delay
              elapsed. */}
          <button className="lp-cta" onClick={onStart}>
            Begin the style quiz
          </button>
        </div>
        {/* No credit line on the video hero — removed per Liz (2026-08-04).
            The .lp-hero-credit styles remain for any future hero that
            carries one. */}
      </section>

      <section className="lp-rail">
        <div className="lp-rail-head" data-reveal>
          <h2 className="lp-rail-title">Shop Our Edit</h2>
          <Link className="lp-link" href="/browse">
            Shop all
          </Link>
        </div>
        <div className="lp-rail-grid">
          {RAIL_EDITS.map((edit, i) => (
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

      {/* Mobile menu panel. Lives at page level rather than inside <nav>: the
          bar is a stacking context and fades to opacity 0 past the hero, which
          would take a nested panel with it. */}
      <MobileMenuPanel
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onSubscribe={() => setSubscribeOpen(true)}
      />

      {/* Opened by "Subscribe" in the mobile drawer. Desktop keeps the
          .lp-join dropdown; this is the phone's route to the same
          /api/subscribe endpoint, tagged with its own source so the two are
          distinguishable in the subscriber table. */}
      {subscribeOpen && (
        <SubscribeModal source="landing_nav_mobile" onClose={() => setSubscribeOpen(false)} />
      )}
    </div>
  );
}


