import Link from "next/link";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";

export const metadata = {
  title: "About — The Interior Index",
  description:
    "The Interior Index is a design concierge for people who value thoughtful spaces.",
};

// Stripped back to the claim, the paragraph under it, and the two CTAs
// (Liz, 2026-08-27: "simplify this page"). What came out — the About
// eyebrow, the "Most homes are decorated by style" line, the three image
// placeholders, the Why material / The standard / How the Edit works
// sections, the "Style dates. Material doesn't." pull quote and the
// "Beautiful things, indexed by what they're made of" signoff — is kept in
// full at TII/archive/about-page-full-draft-20260827.tsx. This file had
// never been committed, so that archive is the only copy of that writing.
const css = `
/* Centred lockup, matching every other header on the site (Liz,
   2026-08-27). Nothing else sits in this bar now that "Back to home" is
   gone — the menu carries that. */
.about-header { padding: 2rem 3rem; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--linen); }

/* Two columns: the words left, one photograph right, the pair centred
   against each other so the image reads as a companion to the claim rather
   than an illustration under it. minmax caps the picture so it never
   outgrows the text on a wide monitor. */
/* Vertical rhythm measured off the mockup (2130x1034). Against the header
   rule there: photo top +78px, headline top +167px; below, photo bottom to
   the footer rule 138px. So the photo is NOT centred in the band — it sits
   high and its own height sets the section height. max-width is 1396 so that
   after the 3rem gutters the content box is the 1300px the comp divides. */
/* No flex:1, so the content band is exactly the height the comp draws:
   78px from the header rule to the photo, the photo's own 523px, then 138px
   to the footer rule — 739px total, against the comp's 736px. With flex:1 the
   main stretched to fill the viewport and that surplus landed between the
   photo and the footer, which is what pushed the gap to 281px.
   No seam results: body is --warm-white and .ft is --warm-white, so on a
   window taller than the page the area below the footer is the same colour
   as the footer itself. */
/* Percentage geometry, not a centred max-width box. Measured off the comp:
   the content starts at 16.4% of the viewport and runs to 77.2%, so it is
   60.8% wide and sits LEFT of centre - it is not centred at all. A capped,
   centred container was making everything ~20% smaller and pushing the left
   margin out to 24.7% on a wide screen. */
/* flex:1 so the section always fills the viewport and the footer sits on the
   bottom edge - without it the page ends short on a tall window and the strip
   below reads as extra footer, since body and .ft are both --warm-white. The
   cost is that on a window taller than the content the surplus lands between
   the photo and the footer, so the comp's 138px is a floor rather than a
   fixed value. */
.about-main { flex: 1; width: 60.8%; max-width: none; margin: 0 0 0 16.4%; padding: 4.9rem 0 8.6rem; }
/* Proportions measured off Liz's mockup rather than guessed. In that comp
   the content spans 16.4%–77.2% of the viewport and divides as
   text 541px : gap 372px : photo 382px — i.e. 41.8% / 28.7% / 29.5% of the
   span, or 1.42fr and 1fr either side of a 28.7% gutter. A percentage
   column-gap resolves against the grid's own width, so the fr tracks split
   what is left and the three proportions hold at every width. */
/* Comp splits the span text 41.8% / gap 28.7% / photo 29.5%, which is
   1.42fr and 1fr either side of a 28.7% gutter. */
.about-grid { display: grid; grid-template-columns: 1.42fr 1fr; column-gap: 28.7%; align-items: start; }
/* 167px below the header rule in the comp, i.e. 89px below the photo top. */
.about-open { max-width: none; padding-top: 5.56rem; }
/* No forced ratio: the mockup shows the photo at its native 577x784 (0.735),
   and the box measured there is 382x520 — the same 0.735. Cropping it to 4:5
   was tightening the frame the comp didn't tighten. */
.about-figure { background: var(--panel); }
.about-figure img { width: 100%; height: auto; display: block; }
.about-lead { font-family: var(--font-cormorant), serif; /* 43px at the comp's 2130px width = 2.02vw, so the claim scales with the
   column instead of hitting a cap and under-filling it on a wide screen. */
  font-size: clamp(1.9rem, 2.02vw, 3.4rem); font-weight: 300; line-height: 1.18; color: var(--text-dark); letter-spacing: -0.015em; }
/* Italics stay italic but drop the terracotta — the whole page is one ink
   now (Liz, 2026-08-27). --text-dark (#2A1F15) is the darkest ink in the
   palette, a shade deeper than the --bark the headline used, so it reads as
   black against the cream without going to a flat #000 that would look
   harsh next to it. */
.about-lead em { font-style: italic; color: inherit; }
/* Line one is the brand lockup, set in caps with wider tracking exactly as
   the hero had it. Drop this rule and the wrapping span to have it read in
   sentence case like the rest of the sentence. */
.about-lead-brand { text-transform: uppercase; letter-spacing: 0.11em; }
/* Up from 1.075rem, and off the mid-brown onto the same ink as the claim. */
.about-intro { max-width: none; margin-top: 2.2rem; font-size: 1.08rem; line-height: 1.9; color: var(--text-dark); font-weight: 300; }

/* Quiz leads as a solid box, matching the hero CTA; Shop Our Edit sits
   beside it as a plain link so the two do not read as equals. */
.about-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 2.2rem; margin-top: 5.4rem; }
.about-cta-primary { display: inline-block; font-family: var(--font-jost), sans-serif; font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase; color: #10180F; background: var(--cream); border: 1px solid var(--linen); padding: 1.15rem 2.7rem 1.1rem; text-decoration: none; font-weight: 400; transition: background 0.3s; }
.about-cta-primary:hover { background: #E9C48F; }
.about-cta { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dark); text-decoration: none; font-weight: 400; transition: gap 0.3s, color 0.3s; }
.about-cta:hover { gap: 1rem; opacity: 0.6; }

/* Stack before the columns get too narrow to hold the claim's three lines. */
@media (max-width: 1100px) {
  /* Back to a normal gutter once the percentage geometry stops being useful. */
  .about-main { width: auto; margin: 0 auto; padding-left: 3rem; padding-right: 3rem; max-width: 1000px; }
}
@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; column-gap: 0; gap: 3rem; }
  .about-open { padding-top: 0; }
  .about-figure { max-width: 420px; }
}
@media (max-width: 640px) {
  .about-header { padding: 1.5rem; --mm-inset: 1.5rem; }
  .about-main { padding: 4.5rem 1.5rem 5.5rem; }
  /* Let the claim wrap naturally on a phone rather than forcing three lines. */
  .about-lead br { display: none; }
  .about-lead-brand { letter-spacing: 0.08em; }
  .about-intro { font-size: 1.08rem; }
  .about-ctas { flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: 4rem; }
  .about-cta-primary { width: 100%; text-align: center; }
}
`;

export default function AboutPage() {
  return (
    <div className="screen active">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className="about-header">
        <MobileMenu />
        <Link href="/" className="logo">
          The Interior <span>Index</span>
        </Link>
      </header>

      <main className="about-main">
        <div className="about-grid">
        <div className="about-open">
          {/* Copy is verbatim from the video hero, which was stripped back to
              its CTA on 2026-08-27. */}
          {/* Same three-line break pattern the video hero used: the brand
              lockup alone on line one, then the claim across two. The {" "}
              after each <br /> matters — the breaks are hidden on small
              screens, and without an explicit space JSX leaves none between
              the segments, so the words fuse ("INDEXis a ... peoplewho").
              Same trap that was caught on the hero's mobile pass. */}
          <h1 className="about-lead">
            <span className="about-lead-brand">
              The Interior <em>Index</em>
            </span>
            <br />{" "}is a design concierge for people
            <br />{" "}who value <em>thoughtful spaces</em>.
          </h1>
          <p className="about-intro">
            Beautiful homes are built through thoughtful choices. From everyday finds to heirloom pieces. We
            curate across styles, brands, materials and budget. Helping you discover pieces worth bringing
            home.
          </p>

          {/* /?start=1 rather than "/" — a bare "/" from another route just
              lands on the home screen; ?start=1 is what actually opens the
              quiz (see the searchParams effect in app/page.tsx, same link the
              footer uses). */}
          <div className="about-ctas">
            <Link href="/?start=1" className="about-cta-primary">
              Begin the style quiz
            </Link>
            <Link href="/browse" className="about-cta">
              Shop Our Edit →
            </Link>
          </div>
        </div>

        <figure className="about-figure">
          <img
            src="/about/cesca-cane.png"
            alt="A round travertine pedestal table with two cane Cesca chairs and a green banquette"
          />
        </figure>
        </div>
      </main>

      <Footer />
    </div>
  );
}
