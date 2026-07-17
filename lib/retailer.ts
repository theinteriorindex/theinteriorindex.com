// Derives a human-readable retailer name from a product's outbound link so
// CTAs like "Shop on Amazon" / "Shop on Eternity Modern" stay accurate as we
// add brands, instead of a hardcoded "Shop on Amazon" that was wrong for
// every non-Amazon merchant (e.g. Eternity Modern's AWIN links).
//
// AWIN affiliate links wrap the real destination in a `p=` query param
// (e.g. http://www.awin1.com/cread.php?...&p=https://eternitymodern.com/...),
// so we unwrap that before reading the hostname.

const RETAILER_HOSTS: Record<string, string> = {
  "amazon.com": "Amazon",
  "amzn.to": "Amazon",
  "eternitymodern.com": "Eternity Modern",
  "islacapricho.com": "Isla Capricho",
  "thevintagerealm.com": "The Vintage Realm",
  "hulalahome.com": "HuLaLa Home",
  "hulalahome.prf.hn": "HuLaLa Home",
  "noguchi.org": "Noguchi",
};

export function extractHostname(link: string): string | null {
  try {
    const url = new URL(link);
    const wrapped = url.searchParams.get("p");
    if (wrapped) {
      try {
        return new URL(wrapped).hostname.replace(/^www\./, "");
      } catch {
        // fall through and use the outer hostname
      }
    }
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function getRetailerLabel(link: string): string | null {
  const host = extractHostname(link);
  if (!host) return null;
  for (const [domain, label] of Object.entries(RETAILER_HOSTS)) {
    if (host === domain || host.endsWith(`.${domain}`)) return label;
  }
  return null;
}

export function getShopCta(link: string): string {
  const label = getRetailerLabel(link);
  return label ? `Shop on ${label}` : "Shop Now";
}
