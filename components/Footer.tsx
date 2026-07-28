"use client";

import Link from "next/link";

// Site footer — "The Endpaper": light, centred, symmetrical, so the page
// closes the way the landing page opens (still, quiet, no motion). Rendered
// on the content surfaces (home / results / browse / legal pages), NOT
// during the quiz or chat flow, where a footer would sit under an
// interaction that owns the whole viewport.
//
// The affiliate disclosure is linked here rather than only from its own
// route, so a path to it sits on every page alongside the affiliate links
// themselves.
//
// Deliberately carries no email capture: "Join the Edit" already lives in
// the landing page's nav, which opens SubscribeModal. A second signup at
// the bottom of the same page competed with it rather than adding reach.
//
// "The Quiz" needs two behaviours, because the quiz is client state inside
// app/page.tsx rather than a route of its own. On the home page, pass
// onQuizClick and it renders a button that starts the quiz directly — a
// link can't do that, and a bare "/" link is a no-op there. Everywhere
// else, no prop, and it renders a link to /?start=1, which the home page
// picks up on arrival. Doing it by prop rather than by URL also means
// clicking it twice from home works; a same-URL link click is not a
// navigation, so a URL-only approach goes dead after the first use.

export default function Footer({ onQuizClick }: { onQuizClick?: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <Link href="/" className="ft-logo">
        The Interior <em>Index</em>
      </Link>
      <div className="ft-tag">A material-based design concierge</div>

      <nav className="ft-nav" aria-label="Footer">
        {onQuizClick ? (
          <button className="ft-link-btn" type="button" onClick={onQuizClick}>
            The Quiz
          </button>
        ) : (
          <Link href="/?start=1">The Quiz</Link>
        )}
        <span className="ft-dot" aria-hidden="true" />
        <Link href="/browse">Shop Our Edit</Link>
        <span className="ft-dot" aria-hidden="true" />
        <a
          href="https://www.pinterest.com/the_interior_index/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pinterest
        </a>
        <span className="ft-dot" aria-hidden="true" />
        <a
          href="https://www.amazon.com/shop/influencer-7a001172"
          target="_blank"
          rel="noopener noreferrer"
        >
          Storefront
        </a>
      </nav>

      <div className="ft-rule" />

      <div className="ft-fine">
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
      <div className="ft-copy">&copy; {year} The Interior Index</div>
    </footer>
  );
}
