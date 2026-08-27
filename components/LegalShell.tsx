import Link from "next/link";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";

// Shared shell for the static/legal pages (Affiliate Disclosure, Privacy).
// Styles are co-located here as an inline <style> so they ship with this
// component's module and don't depend on the global stylesheet recompiling.
const css = `
/* Centred lockup, matching every other header on the site (Liz,
   2026-08-27); the back link rides absolutely on the right so it never
   shifts that centre, and goes entirely on a phone where the menu carries
   the same navigation. */
.legal-header { padding: 2rem 3rem; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--linen); }
.legal-back { position: absolute; right: 3rem; top: 50%; transform: translateY(-50%); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--stone); font-weight: 300; text-decoration: none; transition: color 0.3s; }
.legal-back:hover { color: var(--terracotta); }
.legal-page { flex: 1; max-width: 800px; margin: 0 auto; padding: 3.25rem 2rem 5rem; width: 100%; }
.legal-eyebrow { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 1.25rem; font-weight: 400; }
.legal-title { font-family: var(--font-cormorant), serif; font-size: clamp(2.25rem, 4vw, 3rem); font-weight: 300; line-height: 1.1; color: var(--bark); margin-bottom: 0.6rem; }
.legal-updated { font-size: 0.72rem; letter-spacing: 0.02em; color: var(--text-light); font-weight: 300; margin-bottom: 1.75rem; }
.legal-page h2 { font-family: var(--font-cormorant), serif; font-size: 1.2rem; font-weight: 500; color: var(--bark); margin: 1.85rem 0 0.5rem; }
.legal-page p { font-size: 0.86rem; line-height: 1.65; color: var(--text-mid); font-weight: 300; margin-bottom: 0.75rem; }
.legal-page ul { margin: 0 0 0.75rem 1.1rem; }
.legal-page li { font-size: 0.86rem; line-height: 1.6; color: var(--text-mid); font-weight: 300; margin-bottom: 0.3rem; }
.legal-page li strong { font-weight: 500; color: var(--walnut); }
.legal-page a { color: var(--terracotta); text-decoration: underline; text-underline-offset: 2px; }
.legal-page a:hover { color: var(--walnut); }
.legal-note { font-size: 0.82rem; line-height: 1.7; color: var(--text-light); font-weight: 300; font-style: italic; border-top: 1px solid var(--linen); margin-top: 3rem; padding-top: 1.5rem; }
@media (max-width: 900px) {
  .legal-back { display: none; }
}
@media (max-width: 640px) {
  .legal-header { padding: 1.5rem; --mm-inset: 1.5rem; }
  .legal-page { padding: 3rem 1.5rem 4rem; }
}
`;

export default function LegalShell({
  eyebrow = "The Interior Index",
  title,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="screen active">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className="legal-header">
        <MobileMenu />
        <Link href="/" className="logo">
          The Interior <span>Index</span>
        </Link>
        <Link href="/" className="legal-back">
          ← Back to home
        </Link>
      </header>
      <main className="legal-page">
        <div className="legal-eyebrow">{eyebrow}</div>
        <h1 className="legal-title">{title}</h1>
        {updated ? <p className="legal-updated">{updated}</p> : null}
        {children}
      </main>
      <Footer />
    </div>
  );
}
