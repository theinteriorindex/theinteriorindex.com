import { supabase } from "./supabaseClient";
import type { Product, ProductGroup } from "./catalog";

// Reads the live catalog from Supabase (products + product_images, exposed
// via the per-collection views: walnut_living_room, walnut_dining_room,
// oak_living_room, oak_dining_room, the_light_edit) instead of the static
// lib/catalog.ts file. Mirrors the same tab-label conventions and
// complementary-material pairing logic as getMaterialProducts/getEditCatalog
// in lib/catalog.ts, just async and DB-backed.

type ViewRow = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  description: string | null;
  affiliate_url: string | null;
  sort_order: number;
  is_active: boolean;
  images: string[] | null;
};

const VIEW_NAMES = [
  "walnut_living_room",
  "walnut_dining_room",
  "oak_living_room",
  "oak_dining_room",
  "the_light_edit",
] as const;
type ViewName = (typeof VIEW_NAMES)[number];

async function fetchView(viewName: ViewName): Promise<ViewRow[]> {
  const { data, error } = await supabase.from(viewName).select("*").order("sort_order");
  if (error) {
    console.error(`Error fetching ${viewName} from Supabase:`, error.message);
    return [];
  }
  return (data as ViewRow[]) || [];
}

function toProduct(row: ViewRow): Product {
  return {
    name: row.name,
    link: row.affiliate_url || "#",
    images: row.images || [],
  };
}

// Maps a Supabase `category` value onto the tab labels the site already
// uses (matching lib/catalog.ts's existing conventions).
function tabLabelFor(row: ViewRow, isDining: boolean): string {
  switch (row.category) {
    case "Coffee Table":
      return "Coffee Tables";
    case "Side Tables":
      return "Side Tables";
    case "Seating":
    case "Accents":
      return isDining ? "Dining Chairs" : "Seating";
    case "Dining Table":
      return "Dining Tables";
    case "Lighting": {
      const n = row.name.toLowerCase();
      return n.includes("pendant") || n.includes("ceiling") ? "Pendants" : "Table Lamps";
    }
    default:
      return row.category;
  }
}

function groupByTab(rows: ViewRow[], isDining: boolean): ProductGroup {
  const groups: ProductGroup = {};
  for (const row of rows) {
    const tab = tabLabelFor(row, isDining);
    if (!groups[tab]) groups[tab] = [];
    groups[tab].push(toProduct(row));
  }
  return groups;
}

export async function getMaterialProductsFromDB(material: string, room: string): Promise<ProductGroup> {
  const isDining = room === "Dining Room";
  if (material.toLowerCase().includes("walnut")) {
    return groupByTab(await fetchView(isDining ? "walnut_dining_room" : "walnut_living_room"), isDining);
  }
  if (material.toLowerCase().includes("oak")) {
    return groupByTab(await fetchView(isDining ? "oak_dining_room" : "oak_living_room"), isDining);
  }
  return groupByTab(await fetchView("walnut_living_room"), false);
}

export async function getEditCatalogFromDB(material: string, room: string, priority: string): Promise<ProductGroup> {
  const isLighting = Boolean(priority && priority.toLowerCase().includes("lighting"));
  const isDining = room === "Dining Room";
  const isWalnut = Boolean(material && material.toLowerCase().includes("walnut"));
  const isOak = Boolean(material && material.toLowerCase().includes("oak"));

  if (isLighting) {
    return groupByTab(await fetchView("the_light_edit"), false);
  }

  if (isDining) {
    return getMaterialProductsFromDB(material, room);
  }

  if (isWalnut) {
    const [walnutRows, oakRows, lightRows] = await Promise.all([
      fetchView("walnut_living_room"),
      fetchView("oak_living_room"),
      fetchView("the_light_edit"),
    ]);
    const walnut = groupByTab(walnutRows, false);
    const oak = groupByTab(oakRows, false);
    const light = groupByTab(lightRows, false);
    return {
      "Coffee Tables": walnut["Coffee Tables"] || [],
      "Side Tables": oak["Side Tables"] || [],
      Seating: walnut["Seating"] || [],
      "Table Lamps": light["Table Lamps"] || [],
    };
  }

  if (isOak) {
    const [oakRows, walnutRows, lightRows] = await Promise.all([
      fetchView("oak_living_room"),
      fetchView("walnut_living_room"),
      fetchView("the_light_edit"),
    ]);
    const oak = groupByTab(oakRows, false);
    const walnut = groupByTab(walnutRows, false);
    const light = groupByTab(lightRows, false);
    return {
      "Coffee Tables": oak["Coffee Tables"] || [],
      "Side Tables": walnut["Side Tables"] || [],
      Seating: oak["Seating"] || [],
      "Table Lamps": light["Table Lamps"] || [],
    };
  }

  return getMaterialProductsFromDB(material, room);
}
