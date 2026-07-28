import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Affiliate Disclosure — The Interior Index",
  description:
    "How The Interior Index uses affiliate links, and our commitment to editorial independence.",
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalShell title="Affiliate Disclosure">
      <h2>Affiliate Disclosure</h2>
      <p>
        When you purchase something through some of the links on our site and in your curated edit, The Interior
        Index may earn a commission, at no additional cost to you. We monetize by participating in affiliate
        programs.
      </p>

      <h2>Affiliate Disclaimer</h2>
      <p>
        The Interior Index does not accept money or gifts in exchange for product reviews or endorsements. Every
        piece is chosen for its design, quality, and value alone.
      </p>
    </LegalShell>
  );
}
