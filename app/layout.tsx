import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

// Self-hosted via next/font instead of a Google Fonts <link> tag. The old
// <link> approach needed two sequential external round-trips (fonts.
// googleapis.com for the CSS, then fonts.gstatic.com for the actual woff2)
// before any custom type could render — on a cold cache that regularly blew
// past the browser's font-loading budget, so the page fell back to the
// generic serif/sans-serif system font for that entire view (visibly
// heavier than these fonts' light 300 weight) and never swapped in the real
// font, even after it finished downloading a moment later. Refreshing
// "fixed" it only because the font was cached by then.
// next/font fetches and self-hosts the font files at build time (no more
// runtime race against an external host) and auto-generates a fallback
// font tuned to match Cormorant Garamond/Jost's real metrics, so — unlike
// the plain <link> version — it's safe to use display: "swap" here without
// reintroducing the layout-shift "pop" that made this site switch to
// display: "optional" in the first place.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "The Interior Index — A Material-Based Design Concierge",
  description:
    "Minimalist home decor curated by material. Find your style profile and get AI-powered design recommendations for your space.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${jost.variable}`}>
      <head>
        <meta name="fo-verify" content="0ceb7be8-d272-483c-b08b-fdbf2a046f65" />
        <meta name="p:domain_verify" content="cb44deaf1f49d8ef664a551febc1d572" />
        <meta name="referrer" content="no-referrer" />
        {/* Pinterest conversion tag (Tag ID 2612711108979) — created in the
            Pinterest Ads account already, this is the last step to let
            Pinterest actually detect it on the site. afterInteractive is the
            right strategy here: it's a tracking pixel, not something that
            needs to block first paint, and Next.js recommends
            afterInteractive for third-party analytics tags like this one. */}
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
  n=window.pintrk;n.queue=[],n.version="3.0";var
  t=document.createElement("script");t.async=!0,t.src=e;var
  r=document.getElementsByTagName("script")[0];
  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '2612711108979');
pintrk('page');`}
        </Script>
        <noscript>
          <img
            height={1}
            width={1}
            style={{ display: "none" }}
            alt=""
            src="https://ct.pinterest.com/v3/?event=init&tid=2612711108979&noscript=1"
          />
        </noscript>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
