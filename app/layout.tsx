import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Interior Index — A Material-Based Design Concierge",
  description:
    "Minimalist home decor curated by material. Find your style profile and get AI-powered design recommendations for your space.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="fo-verify" content="0ceb7be8-d272-483c-b08b-fdbf2a046f65" />
        <meta name="p:domain_verify" content="cb44deaf1f49d8ef664a551febc1d572" />
        <meta name="referrer" content="no-referrer" />
        {/* display=optional (not swap): with "swap", the page renders in a
            fallback font first and reflows to Cormorant Garamond/Jost the
            moment they finish loading — different fonts measure text
            differently, so that swap is what caused the "random pop where
            everything extends" (headings, option-card titles, and anything
            else in these fonts jumping to a new size/height mid-load).
            "optional" still uses the fallback immediately, but only swaps
            in the real font if it's already cached/fast enough to avoid a
            visible reflow — otherwise it just keeps the fallback for that
            page view rather than popping in late. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=optional"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
