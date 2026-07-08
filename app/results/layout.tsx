import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Curated Edit — The Interior Index",
  description: "Your material-matched furniture edit, curated by room, aesthetic, and budget.",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
