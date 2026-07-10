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
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
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
