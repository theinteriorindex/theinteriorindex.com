import HomeBrowsePreview from "./HomeBrowsePreview";

export default function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen active">
      <header className="site-header">
        <div className="logo">
          The Interior <span>Index</span>
        </div>
        <div className="nav-tag">A material-based design concierge</div>
      </header>
      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Your space,
            <br />
            <em>curated</em>
            <br />
            by material.
          </h1>
          <p className="hero-body">
            Tell us how you want your space to feel. We&apos;ll identify your material palette, curate the right
            pieces, and connect you with finds that fit your aesthetic and your budget.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary" onClick={onStart}>
              Begin the style quiz{" "}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <HomeBrowsePreview />
    </div>
  );
}
