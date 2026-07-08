import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Our Edit — The Interior Index",
  description: "Every curated piece across every material, filterable by material and category.",
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
