"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowseProducts, type BrowseProduct } from "@/lib/catalogData";
import BrowseProductCard from "./BrowseProductCard";

// How many cards show before the toggle — matches one full row-and-a-bit at
// the Browse Our Edit page's 4-column grid width, so the initial view reads
// as a deliberate two-row preview rather than a cut-off row.
const PREVIEW_COUNT = 8;

// Same material list/order as BrowseEditsScreen — kept as its own constant
// here rather than shared, since this preview still intentionally skips the
// not-yet-live "notify me" modal and URL sync that the full /browse page
// has. It does now mirror BrowseEditsScreen's category sub-filter (see
// categoryTags below), so material + category filtering matches exactly.
const ALL_MATERIALS = ["Walnut", "Oak", "Stone", "Natural Fibers", "Chrome", "Ceramic", "Lighting"];

// Same fixed category order as BrowseEditsScreen, so the preview grid
// clusters products in the identical sequence as the full /browse page
// instead of raw fetch order — Throws pinned last in both places.
const CATEGORY_ORDER = [
  "Coffee Tables",
  "Side Tables",
  "Console Table",
  "Credenza",
  "Seating",
  "Dining Tables",
  "Dining Chairs",
  "Bedframe",
  "Bench",
  "Desk",
  "Storage",
  "Lamps",
  "Pendants",
  "Lighting",
  "Decor",
  "Throws",
];

function categoryRank(category: string): number {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

// Same synonym map as BrowseEditsScreen — see the comment there for why
// this exists and why it targets the display *label* (tabLabelFor()'s
// output, e.g. "Lamps"/"Throws") rather than the raw Supabase
// category column.
const SEARCH_SYNONYMS: Record<string, string[]> = {
  sofa: ["seating"],
  couch: ["seating"],
  sectional: ["seating"],
  loveseat: ["seating"],
  armchair: ["seating"],
  ottoman: ["seating"],
  pouf: ["seating"],
  stool: ["seating"],
  recliner: ["seating"],
  sconce: ["lamps", "pendants"],
  chandelier: ["lamps", "pendants"],
  nightstand: ["side table", "side tables"],
  vase: ["decor"],
  bowl: ["decor"],
  pillow: ["throws"],
  cushion: ["throws"],
  blanket: ["throws"],
  cabinet: ["storage"],
  shelf: ["storage"],
  shelving: ["storage"],
};

function matchesSearchSynonym(category: string, q: string): boolean {
  if (!q) return false;
  const cat = category.toLowerCase();
  for (const [keyword, categories] of Object.entries(SEARCH_SYNONYMS)) {
    if ((keyword.includes(q) || q.includes(keyword)) && categories.includes(cat)) return true;
  }
  return false;
}

// Homepage preview of the full Browse Our Edit page (components/BrowseEditsScreen.tsx)
// — same data source, same card, same grid styling, same material tag row,
// so it reads as a continuation of that page rather than a different
// design. Shows PREVIEW_COUNT at a time; "Discover more" replaces the
// current batch with the next PREVIEW_COUNT (not an expand/accumulate),
// since this is a taste of the catalog, not the full filterable browse
// experience (category sub-filter, URL sync, notify-me) that still lives
// at /browse.

// How long the fade-out runs before the next batch swaps in — kept short
// and eased so the swap reads as a quiet crossfade, not a loading flicker.
const FADE_MS = 280;

export default function HomeBrowsePreview() {
  const [products, setProducts] = useState<BrowseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getBrowseProducts().then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Category is a *secondary* filter that only makes sense once a material
  // is chosen — scoped to that material's own products, same as
  // BrowseEditsScreen's categoryTags.
  const categoryTags = useMemo(() => {
    if (!selectedMaterial) return [];
    const present = Array.from(new Set(products.filter((p) => p.material === selectedMaterial).map((p) => p.category)));
    return present.sort((a, b) => {
      const ai = categoryRank(a);
      const bi = categoryRank(b);
      return ai === bi ? a.localeCompare(b) : ai - bi;
    });
  }, [products, selectedMaterial]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          (!selectedMaterial || p.material === selectedMaterial) &&
          (!selectedCategory || p.category === selectedCategory) &&
          (!q ||
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q) ||
            matchesSearchSynonym(p.category, q))
      )
      .sort((a, b) => {
        const ai = categoryRank(a.category);
        const bi = categoryRank(b.category);
        return ai === bi ? a.name.localeCompare(b.name) : ai - bi;
      });
  }, [products, selectedMaterial, selectedCategory, search]);

  const visible = filtered.slice(pageIndex * PREVIEW_COUNT, pageIndex * PREVIEW_COUNT + PREVIEW_COUNT);
  const hasMore = filtered.length > (pageIndex + 1) * PREVIEW_COUNT;

  function selectMaterial(m: string | null) {
    setSelectedMaterial(m);
    setSelectedCategory(null);
    setPageIndex(0);
  }

  function selectCategory(c: string) {
    setSelectedCategory((prev) => (prev === c ? null : c));
    setPageIndex(0);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPageIndex(0);
  }

  // Fades the current 8 out, swaps in the next 8 while invisible, then fades
  // the new batch in — a replace, not an expand, per the ask.
  function handleDiscoverMore() {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setPageIndex((p) => p + 1);
      setFading(false);
    }, FADE_MS);
  }

  return (
    <div className="products-section" style={{ borderTop: "1px solid var(--linen)" }}>
      <div className="products-title">Browse Our Edit</div>

      <div className="browse-toolbar">
        <div className="browse-tags" style={{ margin: 0 }}>
          <button
            className={`browse-tag ${!selectedMaterial ? "active" : ""}`}
            onClick={() => selectMaterial(null)}
          >
            All
          </button>
          {ALL_MATERIALS.map((m) => (
            <button
              key={m}
              className={`browse-tag ${selectedMaterial === m ? "active" : ""}`}
              onClick={() => selectMaterial(selectedMaterial === m ? null : m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="browse-search">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search Browse Our Edit"
          />
          {search && (
            <button className="browse-search-clear" onClick={() => handleSearchChange("")} aria-label="Clear search">
              ×
            </button>
          )}
          <svg className="browse-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {selectedMaterial && categoryTags.length > 0 && (
        <div className="browse-tags browse-tags-secondary">
          {categoryTags.map((c) => (
            <button
              key={c}
              className={`browse-tag ${selectedCategory === c ? "active" : ""}`}
              onClick={() => selectCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-light)",
            fontStyle: "italic",
          }}
        >
          Loading edits…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-light)",
            fontStyle: "italic",
          }}
        >
          No pieces match that combination yet.
        </div>
      ) : (
        <>
          <div
            className="browse-product-grid"
            style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
          >
            {visible.map((p, i) => (
              <BrowseProductCard key={p.name + i} product={p} />
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <button className="btn-secondary" onClick={handleDiscoverMore} disabled={fading}>
                Discover more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
