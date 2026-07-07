"use client";

import { useEffect, useRef, useState } from "react";
import type { BrowseProduct } from "@/lib/catalogData";

// Card for the Browse Our Edit grid: title + retailer under the image (not a
// hover overlay like the results-page ProductCard), but still peeks at the
// next product image on hover — using the exact same mounting pattern as
// ProductCard (all of a product's images sit in the DOM from the start, with
// native loading="lazy" pacing anything past the first) so the crossfade
// timing and feel matches exactly. A previous version only mounted the
// second image on hover to limit requests, but that meant the fade sometimes
// started before the browser had committed the image's initial state,
// making it snap instead of ease — eager-mounting avoids that entirely, and
// native lazy-loading already paces off-screen images sensibly on its own.
//
// Cards also fade/slide up into place as they scroll into view instead of
// all rendering at once — an IntersectionObserver flips `visible` and the
// CSS transition does the rest.
export default function BrowseProductCard({ product }: { product: BrowseProduct }) {
  const [hovered, setHovered] = useState(false);
  const [hiddenImages, setHiddenImages] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const multi = product.images.length > 1;
  const displayIdx = hovered && multi && !hiddenImages.has(1) ? 1 : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={ref}
      className={`browse-product-card ${visible ? "in-view" : ""}`}
      href={product.link}
      target="_blank"
      rel="noopener"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="browse-product-img">
        {product.images.map((img, i) => (
          <img
            key={img + i}
            src={img}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => setHiddenImages((prev) => new Set(prev).add(i))}
            style={{ opacity: hiddenImages.has(i) ? 0 : i === displayIdx ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="browse-product-title">{product.name}</div>
      <div className="browse-product-from">{getStoreName(product.link)}</div>
    </a>
  );
}

function getStoreName(link: string): string {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    if (host.includes("amazon") || host.includes("amzn")) return "Amazon";
    return host;
  } catch {
    return "Amazon";
  }
}
