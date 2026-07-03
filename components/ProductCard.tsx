"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const [hiddenImages, setHiddenImages] = useState<Set<number>>(new Set());
  const multi = product.images.length > 1;

  const shift = (dir: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((prev) => (prev + dir + product.images.length) % product.images.length);
  };

  const setSlide = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(i);
  };

  return (
    <div className="product-card">
      <div className="card-slides">
        {product.images.map((img, i) => (
          <img
            key={img + i}
            src={img}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => setHiddenImages((prev) => new Set(prev).add(i))}
            style={{ opacity: hiddenImages.has(i) ? 0 : i === idx ? 1 : 0 }}
          />
        ))}
      </div>
      {multi && (
        <div className="card-dots">
          {product.images.map((_, i) => (
            <div key={i} className={`card-dot ${i === idx ? "active" : ""}`} onClick={(e) => setSlide(i, e)} />
          ))}
        </div>
      )}
      {multi && (
        <>
          <button className="card-arrow prev" onClick={(e) => shift(-1, e)}>
            &#8249;
          </button>
          <button className="card-arrow next" onClick={(e) => shift(1, e)}>
            &#8250;
          </button>
        </>
      )}
      <a href={product.link} target="_blank" rel="noopener" className="product-overlay">
        <div className="product-overlay-title">{product.name}</div>
        <span className="product-overlay-cta">Shop on Amazon →</span>
      </a>
    </div>
  );
}
