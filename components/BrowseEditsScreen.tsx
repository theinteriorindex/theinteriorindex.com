"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowseProducts, type BrowseProduct } from "@/lib/catalogData";
import BrowseProductCard from "./BrowseProductCard";
import NotifyMeModal from "./NotifyMeModal";

type Props = {
  onBack: () => void;
  onHome: () => void;
};

const ALL_MATERIALS = ["Walnut", "Oak", "Stone", "Natural Materials"];
// Fixed display order for category tags — anything not listed falls back to
// alphabetical, appended after these.
const CATEGORY_ORDER = [
  "Coffee Tables",
  "Side Tables",
  "Seating",
  "Dining Tables",
  "Dining Chairs",
  "Bedframe",
  "Bench",
  "Table Lamps",
  "Pendants",
];

export default function BrowseEditsScreen({ onBack, onHome }: Props) {
  const [products, setProducts] = useState<BrowseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // Material and category are independent single-select slots (not a
  // generic tag list) so picking a new category never bumps the material
  // you already had selected, and vice versa — up to one of each at a time.
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [notifyMaterial, setNotifyMaterial] = useState<string | null>(null);

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

  const materialsWithProducts = useMemo(() => new Set(products.map((p) => p.material)), [products]);

  const categoryTags = useMemo(() => {
    const present = Array.from(new Set(products.map((p) => p.category)));
    return present.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(
      (p) => (!selectedMaterial || p.material === selectedMaterial) && (!selectedCategory || p.category === selectedCategory)
    );
  }, [products, selectedMaterial, selectedCategory]);

  function handleMaterialClick(m: string) {
    if (!materialsWithProducts.has(m)) {
      setNotifyMaterial(m);
      return;
    }
    setSelectedMaterial((prev) => (prev === m ? null : m));
  }

  function handleCategoryClick(c: string) {
    setSelectedCategory((prev) => (prev === c ? null : c));
  }

  function clearFilters() {
    setSelectedMaterial(null);
    setSelectedCategory(null);
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

        <div className="browse-tags">
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-light)", fontStyle: "italic" }}>
            Loading edits…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-light)", fontStyle: "italic" }}>
            No pieces match that combination yet.
          </div>
        ) : (
          <div className="browse-product-grid">
            {filtered.map((p, i) => (
              <BrowseProductCard key={p.name + i} product={p} />
            ))}
          </div>
        )}

        <div className="affiliate-note">
          This edit contains affiliate links. Purchasing through these links supports The Interior Index at no
          additional cost to you.
        </div>
      </div>

      {notifyMaterial && <NotifyMeModal material={notifyMaterial} onClose={() => setNotifyMaterial(null)} />}
    </div>
  );
}
