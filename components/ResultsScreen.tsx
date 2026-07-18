"use client";

import { useMemo, useState, useEffect } from "react";
import { profileMap, type ProductGroup } from "@/lib/catalog";
import { getEditCatalogFromDB } from "@/lib/catalogData";
import { getRoomTabs, getPriorityCategory } from "@/lib/rooms";
import BrowseProductCard from "./BrowseProductCard";
import EmailListModal from "./EmailListModal";
import EmptyTabNotify from "./EmptyTabNotify";
import SubscribeModal from "./SubscribeModal";

type Props = {
  answers: Record<string, string>;
  onRestart: () => void;
  onRetakeQuiz: () => void;
  onBrowseEdits: () => void;
};

// Unlike HomeBrowsePreview's fade-replace, "Discover more" here accumulates
// — each click reveals the next PREVIEW_COUNT on top of what's already
// showing, no fade, since a quiz result is a single set to browse through
// rather than a rotating preview.
const PREVIEW_COUNT = 8;

export default function ResultsScreen({ answers, onRestart, onRetakeQuiz, onBrowseEdits }: Props) {
  const aesthetic = answers.aesthetic || "Organic Modern";
  const profile = profileMap[aesthetic] || profileMap["Organic Modern"];
  const material = answers.material || "Walnut & Dark Wood";
  const room = answers.room || "Living Room";
  const budget = answers.budget || "Under $200";
  const priority = answers.priority || "A statement table";

  const [products, setProducts] = useState<ProductGroup>({});
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    getEditCatalogFromDB(material, room, priority, budget).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setProductsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [material, room, priority, budget]);

  const isLighting = priority.toLowerCase().includes("lighting");
  const isTableSetting = priority.toLowerCase().includes("table setting");
  const isDiningRoom = room === "Dining Room";
  // Every other material reads fine as just its first word ("Walnut",
  // "Oak", "Marble") but "Natural Fibers" needs both words kept together,
  // so it's special-cased rather than truncated to just "Natural".
  const matName = material.startsWith("Natural Fibers") ? "Natural Fibers" : material.split(" ")[0];

  const orderedTabs = useMemo(() => {
    const tabs = Object.keys(products);
    if (isLighting) return ["Table Lamps", "Pendants"].filter((t) => products[t]);
    if (isTableSetting) return ["Tabletop"].filter((t) => products[t]);

    const roomOrder = getRoomTabs(room);
    const priorityCategory = getPriorityCategory(room, priority);
    const hero = priorityCategory && products[priorityCategory] ? priorityCategory : roomOrder.find((t) => products[t]) || tabs[0];

    const order = [hero, ...roomOrder.filter((t) => t !== hero)];
    return order.filter((t) => products[t]);
  }, [products, priority, room, isLighting, isTableSetting]);

  const [activeTab, setActiveTab] = useState(orderedTabs[0]);
  useEffect(() => setActiveTab(orderedTabs[0]), [orderedTabs]);

  const [pageIndex, setPageIndex] = useState(0);
  // A tab switch starts that tab's grid back at its own first page rather
  // than wherever "Discover more" had scrolled the previous tab to.
  useEffect(() => setPageIndex(0), [activeTab]);

  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const tabProducts = products[activeTab] || [];
  const visibleProducts = tabProducts.slice(0, (pageIndex + 1) * PREVIEW_COUNT);
  const hasMoreProducts = tabProducts.length > (pageIndex + 1) * PREVIEW_COUNT;

  function handleDiscoverMore() {
    setPageIndex((p) => p + 1);
  }

  const editLabel = isLighting ? "The Light Edit" : isTableSetting ? "The Table Setting Edit" : `Your ${matName} ${room} Edit`;

  let subCopy = "Curated finds based on your material profile.";
  if (isLighting) subCopy = "Table lamps and pendants — the mood pieces that finish a room.";
  else if (isTableSetting) subCopy = "Plates, napkins, and the finishing touches for the dining table.";
  else if (isDiningRoom) subCopy = "Chairs and tables curated for your dining room.";
  else if (room === "Bedroom") subCopy = "Bedframes, benches, and nightstands curated for a quiet, considered bedroom.";
  else if (room === "Home Office") subCopy = "Desks, seating, and storage curated for a home office that holds up all day.";
  else if (material.toLowerCase().includes("walnut"))
    subCopy = `${matName} anchors the space. Oak side tables and considered lighting bring contrast and balance.`;
  else if (material.toLowerCase().includes("oak"))
    subCopy = `${matName} keeps it airy. Walnut side tables and considered lighting add warmth and depth.`;

  return (
    <div className="screen active">
      {!productsLoading && orderedTabs.length > 0 && (
        <EmailListModal editLabel={editLabel} orderedTabs={orderedTabs} products={products} />
      )}
      <header className="site-header">
        <button className="logo" onClick={onRestart}>
          The Interior <span>Index</span>
        </button>
        <button className="btn-secondary" onClick={onRestart} style={{ fontSize: "0.65rem" }}>
          Start over
        </button>
      </header>
      <div className="results-header">
        <div className="results-eyebrow">Your material profile</div>
        <div className="results-title">
          The <em>{profile.title.replace("The ", "")}</em>
        </div>
        <div className="results-sub">{profile.sub}</div>
      </div>
      <div className="results-cards">
        <div className="result-card">
          <div className="result-card-label">Your material palette</div>
          <div className="result-card-title">{material}</div>
          <div className="result-card-body">
            Your primary material anchors every decision — from the hero furniture piece to the smallest accent.
            Build outward from this foundation.
          </div>
          <div className="material-tags">
            <span className="material-tag">{material.split(" ")[0]}</span>
            <span className="material-tag">Ceramic</span>
          </div>
        </div>
        <div className="result-card">
          <div className="result-card-label">Your room — {room}</div>
          <div className="result-card-title">
            The {aesthetic} {room}
          </div>
          <div className="result-card-body">
            A {aesthetic.toLowerCase()} {room.toLowerCase()} prioritizes material honesty, intentional restraint, and
            pieces that earn their place. Less, but better.
          </div>
          <div className="material-tags">
            <span className="material-tag">{aesthetic}</span>
            <span className="material-tag">Intentional</span>
          </div>
        </div>
        <div className="result-card">
          <div className="result-card-label">Start here — {budget}</div>
          <div className="result-card-title">{priority}</div>
          <div className="result-card-body">
            We recommend beginning with {priority.toLowerCase()} in the {material.toLowerCase()} family. This anchors
            your {room.toLowerCase()} and informs every subsequent purchase.
          </div>
          <div className="material-tags">
            <span className="material-tag">{budget}</span>
            <span className="material-tag">Hero piece</span>
          </div>
        </div>
      </div>
      <div className="products-section">
        <div className="products-eyebrow">The curated edit</div>
        <div className="products-title">{editLabel}</div>
        <div className="products-sub">{subCopy}</div>
        <div className="products-tabs">
          {orderedTabs.map((tab) => (
            <button
              key={tab}
              className={`products-tab ${tab === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="browse-product-grid">
          {productsLoading ? (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-light)",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              Loading curated picks…
            </div>
          ) : tabProducts.length === 0 ? (
            <EmptyTabNotify label={`${matName} ${room} — ${activeTab}`} />
          ) : (
            visibleProducts.map((p, i) => <BrowseProductCard key={p.name + i} product={p} />)
          )}
        </div>
        {!productsLoading && hasMoreProducts && (
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button className="btn-secondary" onClick={handleDiscoverMore}>
              Discover more
            </button>
          </div>
        )}
        <div className="affiliate-note">
          This edit contains affiliate links. Purchasing through these links supports The Interior Index at no
          additional cost to you. Every piece is chosen for material quality, proportion, and value — never for
          commission alone.
        </div>
      </div>
      <div className="results-actions">
        <button className="btn-primary" onClick={onBrowseEdits}>
          Browse Our Edit{" "}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <button className="btn-secondary" onClick={onRetakeQuiz}>
          Retake quiz
        </button>
        <button className="btn-primary" onClick={() => setSubscribeOpen(true)} style={{ marginLeft: "auto" }}>
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
