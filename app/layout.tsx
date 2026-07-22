import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
