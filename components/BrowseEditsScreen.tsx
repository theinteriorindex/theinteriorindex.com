"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getBrowseProducts, type BrowseProduct } from "@/lib/catalogData";
import BrowseProductCard from "./BrowseProductCard";
import NotifyMeModal from "./NotifyMeModal";
import SubscribeModal from "./SubscribeModal";

type Props = {
  onBack: () => void;
  onHome: () => void;
};

const ALL_MATERIALS = ["Walnut", "Oak", "Stone", "Natural Materials", "Metal", "Ceramic"];

// "Discover more" accumulates: each click appends the next PREVIEW_COUNT
// items below what's already shown, same pattern as ResultsScreen's product
// grid, rather than replacing the current batch.
const PREVIEW_COUNT = 8;
// Fixed display order for category tags — anything not listed falls back to
// alphabetical, appended after these. Throws is pinned last explicitly
// (rather than relying on it alphabetizing there) so it always reads as a
// supporting/bottom category, matching its "supporting tab" role on the
// results pages.
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
  "Table Lamps",
  "Pendants",
  "Lighting",
  "Decor",
  "Throws",
];

// Shared rank used to both order the category tag list and to sort the
// product grid itself, so a filtered view (e.g. Natural Materials) always
// clusters its products by category in this same fixed order — Throws last
// — instead of showing them in whatever order Supabase happened to return.
function categoryRank(category: string): number {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

// The search bar matches product name/category/material directly, but real
// searches often use a word the catalog itself never uses (nobody searches
// "Seating" — they search "sofa" or "couch"). `category` here is actually
// the same display *label* the tab bar and tag filters use (tabLabelFor()'s
// output, e.g. "Dining Chairs", "Table Lamps", "Throws" — not the raw
// Supabase `category` column), so these synonyms target that label text.
// Checked as a substring both ways so partial typing ("sof") still resolves
// to the full keyword ("sofa").
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
  sconce: ["table lamps", "pendants"],
  chandelier: ["table lamps", "pendants"],
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

// Matches a `?material=` URL value back to one of ALL_MATERIALS, tolerating
// case and dash/underscore-for-space variants (e.g. "natural-materials",
// "OAK") so a hand-typed or Pinterest-shortened link still resolves.
function matchMaterialParam(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[-_]+/g, " ").trim().toLowerCase();
  return ALL_MATERIALS.find((m) => m.toLowerCase() === cleaned) || null;
}

export default function BrowseEditsScreen({ onBack, onHome }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<BrowseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // Material and category are independent single-select slots (not a
  // generic tag list) so picking a new category never bumps the material
  // you already had selected, and vice versa — up to one of each at a time.
  // Initialized from the URL (?material=&category=) so a direct/pinned link
  // lands on the right filter instead of always starting at "All".
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(() =>
    matchMaterialParam(searchParams.get("material"))
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => searchParams.get("category"));
  const [notifyMaterial, setNotifyMaterial] = useState<string | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");

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

  // Keeps the address bar in sync with the current filter selection, so
  // whatever's on screen — whether reached by clicking a tag or by loading a
  // pinned link — always has a matching, copyable/shareable URL.
  function syncUrl(material: string | null, category: string | null) {
    const params = new URLSearchParams();
    if (material) params.set("material", material);
    if (category) params.set("category", category);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const materialsWithProducts = useMemo(() => new Set(products.map((p) => p.material)), [products]);

  // Category is a *secondary* filter that only makes sense once a material
  // is chosen — so the tag list is scoped to that material's own products,
  // not every category across the whole catalog.
  const categoryTags = useMemo(() => {
    if (!selectedMaterial) return [];
    const present = Array.from(new Set(products.filter((p) => p.material === selectedMaterial).map((p) => p.category)));
    return present.sort((a, b) => {
      const ai = categoryRank(a);
      const bi = categoryRank(b);
      return ai === bi ? a.localeCompare(b) : ai - bi;
    });
  }, [products, selectedMaterial]);

  // Sorted by category (Throws last) rather than raw fetch order — most
  // rows share the same sort_order value, so without this the grid's order
  // isn't stable/predictable and throws could land anywhere in the mix
  // instead of clustering at the bottom.
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

  function handleMaterialClick(m: string) {
    if (!materialsWithProducts.has(m)) {
      setNotifyMaterial(m);
      return;
    }
    // Switching (or clearing) material invalidates whatever category was
    // selected, since the category list itself is scoped per-material.
    const next = selectedMaterial === m ? null : m;
    setSelectedCategory(null);
    setSelectedMaterial(next);
    setPageIndex(0);
    syncUrl(next, null);
  }

  function handleCategoryClick(c: string) {
    const next = selectedCategory === c ? null : c;
    setSelectedCategory(next);
    setPageIndex(0);
    syncUrl(selectedMaterial, next);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPageIndex(0);
  }

  function clearFilters() {
    setSelectedMaterial(null);
    setSelectedCategory(null);
    setPageIndex(0);
    syncUrl(null, null);
  }

  const visible = filtered.slice(0, (pageIndex + 1) * PREVIEW_COUNT);
  const hasMore = filtered.length > (pageIndex + 1) * PREVIEW_COUNT;

  function handleDiscoverMore() {
    setPageIndex((p) => p + 1);
  }

  return (
    <div className="screen active">
      <header className="site-header">
        <button className="logo" onClick={onHome}>
          The Interior <span>Index</span>
        </button>
        <button className="btn-secondary" onClick={onBack} style={{ fontSize: "0.65rem" }}>
          ← Back
        </button>
      </header>

      <div className="products-section" style={{ borderTop: "none" }}>
        <div className="products-title">Browse Our Edit</div>

        <div className="browse-toolbar">
          <div className={`browse-tags ${selectedMaterial ? "browse-tags-primary" : ""}`} style={{ margin: 0 }}>
            <button
              className={`browse-tag ${!selectedMaterial && !selectedCategory ? "active" : ""}`}
              onClick={clearFilters}
            >
              All
            </button>
            {ALL_MATERIALS.map((m) => (
              <button
                key={m}
                className={`browse-tag ${selectedMaterial === m ? "active" : ""} ${
                  !materialsWithProducts.has(m) ? "browse-tag-notify" : ""
                }`}
                onClick={() => handleMaterialClick(m)}
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

        {/* Category is a secondary step — it only appears once a material
            is selected, scoped to that material's own categories. */}
        {selectedMaterial && categoryTags.length > 0 && (
          <div className="browse-tags browse-tags-secondary">
            {categoryTags.map((c) => (
              <button
                key={c}
                className={`browse-tag ${selectedCategory === c ? "active" : ""}`}
                onClick={() => handleCategoryClick(c)}
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
              minHeight: "80vh",
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
              minHeight: "80vh",
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
            <div className="browse-product-grid">
              {visible.map((p, i) => (
                <BrowseProductCard key={p.name + i} product={p} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button className="btn-secondary" onClick={handleDiscoverMore}>
                  Discover more
                </button>
              </div>
            )}
          </>
        )}

        <div className="affiliate-note">
          This edit contains affiliate links. Purchasing through these links supports The Interior Index at no
          additional cost to you.
        </div>
      </div>

      {notifyMaterial && <NotifyMeModal material={notifyMaterial} onClose={() => setNotifyMaterial(null)} />}

      <div className="subscribe-corner">
        <button className="btn-primary" onClick={() => setSubscribeOpen(true)}>
          Join the Edit{" "}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {subscribeOpen && <SubscribeModal onClose={() => setSubscribeOpen(false)} />}
    </div>
  );
}
