import { supabase } from "./supabaseClient";
import type { Product, ProductGroup } from "./catalog";
import { getRoomTabs, getPriorityOptions } from "./rooms";

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
  budget_tier: string | null;
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
  "stone_living_room",
  "natural_materials_living_room",
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

// Maps a Supabase `category` value onto the tab labels the site shows,
// room-aware so each room's edit surfaces its own relevant categories
// (e.g. Bedroom gets Bedframe/Bench/Side Tables instead of Coffee Tables).
function tabLabelFor(row: { category: string; name: string }, room: string): string {
  if (room === "Bedroom") {
    const cat = row.category.trim().toLowerCase();
    if (cat === "bedframe") return "Bedframe";
    if (cat === "bench") return "Bench";
    if (cat.startsWith("side table")) return "Side Tables";
    if (cat === "lighting") return "Lighting";
    return row.category;
  }
  if (room === "Home Office") {
    // Office keeps a single "Lighting" tab (task lighting) rather than
    // splitting into Lamps/Pendants like Living/Dining Room do.
    const cat = row.category.trim().toLowerCase();
    if (cat === "desk") return "Desk";
    if (cat === "seating") return "Seating";
    if (cat === "storage") return "Storage";
    if (cat === "lighting") return "Lighting";
    return row.category;
  }
  const isDining = room === "Dining Room";
  switch (row.category) {
    case "Coffee Table":
    case "Console Table":
    case "Credenza":
      // Console tables and credenzas fold into the same "Coffee Tables" tab
      // — it's also what the "A statement table" priority piece leads to
      // (see PRIORITY_OPTIONS in lib/rooms.ts), so all three read as one
      // "anchor table" category rather than three thin, separate tabs.
      return "Coffee Tables";
    case "Side Tables":
    case "Side Table":
      // Supabase has both the singular and plural spelling depending on
      // which intake pass a product came through — always show one tab.
      return "Side Tables";
    case "Seating":
    case "Accents":
      return isDining ? "Dining Chairs" : "Seating";
    case "Dining Table":
      return "Dining Tables";
    case "Throw":
    case "Throws":
      return "Throws";
    case "Lighting": {
      const n = row.name.toLowerCase();
      return n.includes("pendant") || n.includes("ceiling") ? "Pendants" : "Lamps";
    }
    default:
      return row.category;
  }
}

// Browse Our Edit spans every room in one tab bar, unlike the room-scoped
// quiz results pages — so a room-specific tab like Bedroom's "Bench" reads as
// a stray orphan tab there instead of a meaningful category. Fold it into
// "Seating" for Browse Our Edit only; tabLabelFor()'s Bedroom branch (and the
// Bedroom results page that depends on it) is untouched.
function browseTabLabelFor(row: { category: string; name: string }, room: string): string {
  const label = tabLabelFor(row, room);
  return label === "Bench" ? "Seating" : label;
}

// When `budget` is "Under $200", drops any row not tagged that tier before
// grouping — checked via `budget_tier` rather than raw `price` since most of
// the catalog only has the curated tier, not an exact numeric price on file.
//
// Quiet Luxury's quiz (see getBudgetOptions in lib/quiz.ts) splits the
// coarse "$1,000+" budget_tier into two real options, "$1,000 — $2,500" and
// "$2,500+" — Supabase has no such tier value, so these two check the real
// `price` column against the $2,500 line instead. Every $1,000+ product
// has a real price on file today, so this never silently drops a row for
// lacking one.
function filterByBudget(rows: ViewRow[], budget?: string): ViewRow[] {
  if (budget === "Under $200") return rows.filter((r) => r.budget_tier === "Under $200");
  if (budget === "$1,000 — $2,500") return rows.filter((r) => r.budget_tier === "$1,000+" && r.price !== null && r.price < 2500);
  if (budget === "$2,500+") return rows.filter((r) => r.budget_tier === "$1,000+" && r.price !== null && r.price >= 2500);
  return rows;
}

function groupByTab(rows: ViewRow[], room: string, budget?: string): ProductGroup {
  const groups: ProductGroup = {};
  // Some products (e.g. Eternity Modern's dual-aesthetic rows) intentionally
  // have more than one Supabase row for the same physical item — one per
  // aesthetic value — so it can surface under more than one aesthetic edit.
  // But `aesthetic` is never actually filtered on here (it's display-only,
  // see ResultsScreen), so within a single room+material result those rows
  // are indistinguishable and render as literal duplicate cards. Dedupe by
  // name + affiliate link, same key Browse Our Edit already uses, so only
  // one card per physical product shows per tab.
  const seen = new Set<string>();
  for (const row of filterByBudget(rows, budget)) {
    const key = `${row.name.trim().toLowerCase()}|${row.affiliate_url || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tab = tabLabelFor(row, room);
    if (!groups[tab]) groups[tab] = [];
    groups[tab].push(toProduct(row));
  }
  return groups;
}

// Bedroom (and any future room without a dedicated Supabase view) is read
// directly from the products + product_images tables rather than a
// per-room view, since RLS already restricts reads to is_active rows.
// ---- "Metal" is a permanent alias for "Chrome" ----
// This edit was renamed from "Metal" to "Chrome" on 2026-07-28 and every
// Supabase row was migrated, so "Chrome" is the canonical value and the one
// to use for anything new. "Metal" stays readable on purpose, and is not
// leftover migration scaffolding:
//   1. it let the code change and the data flip land separately, with no
//      window where the edit was live but empty; and
//   2. product intake is a hand-filled Google Sheet, so a row can still
//      arrive tagged "Metal" long after the rename — this makes that show up
//      in the right edit instead of vanishing into an unreachable material.
// Worth knowing: because of (2) a mistagged row is silently absorbed rather
// than surfacing as a visible gap, so audit the raw `material` column rather
// than the rendered site when checking whether intake is tagging correctly.
const LEGACY_MATERIAL_VALUE = "Metal";
const MATERIAL_QUERY_ALIASES: Record<string, string[]> = {
  Chrome: ["Chrome", LEGACY_MATERIAL_VALUE],
};
function canonicalMaterial(m: string): string {
  return m === LEGACY_MATERIAL_VALUE ? "Chrome" : m;
}
// Every `products.material` query must go through this, never a bare
// .eq("material", key) — otherwise it silently misses rows stored under the
// alias. That is exactly what broke Question 04 during the rename: the quiz's
// catalog fetch had been updated but getAvailablePriorityTitles' own separate
// query had not, so the priority list collapsed to just its always-available
// entries with no error anywhere.
function materialValues(materialKey: string): string[] {
  return MATERIAL_QUERY_ALIASES[materialKey] ?? [materialKey];
}

async function fetchRoomMaterialRows(room: string, materialKey: string): Promise<ViewRow[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, price, budget_tier, description, affiliate_url, sort_order, is_active")
    .eq("room", room)
    .in("material", materialValues(materialKey))
    .eq("is_active", true)
    .order("sort_order");
  if (error || !products || products.length === 0) {
    if (error) console.error(`Error fetching ${room}/${materialKey} products:`, error.message);
    return [];
  }

  const ids = products.map((p) => p.id);
  const { data: images, error: imgError } = await supabase
    .from("product_images")
    .select("product_id, image_url, sort_order")
    .in("product_id", ids)
    .eq("is_active", true)
    .order("sort_order");
  if (imgError) console.error(`Error fetching images for ${room}/${materialKey}:`, imgError.message);

  const imagesByProduct = new Map<string, string[]>();
  (images || []).forEach((img: { product_id: string; image_url: string }) => {
    const list = imagesByProduct.get(img.product_id) || [];
    list.push(img.image_url);
    imagesByProduct.set(img.product_id, list);
  });

  return products.map((p) => ({ ...p, images: imagesByProduct.get(p.id) || [] }));
}

// Powers "The table setting" priority-piece pick: a curated dining-tabletop
// edit (plates, napkins, tablecloths) that spans two materials (Ceramic +
// Natural Fibers) rather than living under a single material bucket, so
// it's fetched directly instead of through fetchRoomMaterialRows.
async function fetchTabletopEdit(): Promise<ViewRow[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, price, budget_tier, description, affiliate_url, sort_order, is_active")
    .eq("room", "Dining Room")
    .in("material", ["Ceramic", "Natural Fibers"])
    .in("category", ["Side Plate", "Dinner Plate", "Dessert Plate", "Napkin", "Tablecloth"])
    .eq("is_active", true)
    .order("sort_order");
  if (error || !products || products.length === 0) {
    if (error) console.error("Error fetching tabletop edit:", error.message);
    return [];
  }

  const ids = products.map((p) => p.id);
  const { data: images, error: imgError } = await supabase
    .from("product_images")
    .select("product_id, image_url, sort_order")
    .in("product_id", ids)
    .eq("is_active", true)
    .order("sort_order");
  if (imgError) console.error("Error fetching tabletop edit images:", imgError.message);

  const imagesByProduct = new Map<string, string[]>();
  (images || []).forEach((img: { product_id: string; image_url: string }) => {
    const list = imagesByProduct.get(img.product_id) || [];
    list.push(img.image_url);
    imagesByProduct.set(img.product_id, list);
  });

  return products.map((p) => ({ ...p, images: imagesByProduct.get(p.id) || [] }));
}

const TABLETOP_CATEGORIES = ["Side Plate", "Dinner Plate", "Dessert Plate", "Napkin", "Tablecloth"];

// Resolves the quiz's material-question title down to the DB `material`
// value actually used to fetch products, mirroring the branching in
// getMaterialProductsFromDB/getEditCatalogFromDB below. Falls back to
// "Walnut" for anything unrecognized, same as those functions' final
// fallback.
function resolveMaterialKey(material: string): string {
  const m = material.toLowerCase();
  if (m.includes("walnut")) return "Walnut";
  if (m.includes("oak")) return "Oak";
  if (m.includes("stone") || m.includes("marble")) return "Stone";
  if (m.includes("linen") || m.includes("natural")) return "Natural Fibers";
  // "chrome" is the canonical label; "metal" is a permanent alias for it
  // (see the LEGACY_MATERIAL_VALUE note above).
  if (m.includes("chrome") || m.includes("metal")) return "Chrome";
  return "Walnut";
}

// Tab categories that always render with something, regardless of which
// material was chosen, because getEditCatalogFromDB unconditionally merges
// them in from a universal or cross-material source rather than filtering
// by the room+material combination: Living Room's Lamps and Throws,
// Dining Room's Tabletop, and Bedroom's Lighting (falls back to the
// universal Light Edit whenever no room-tagged product fills it), and Home
// Office's Lighting (same Light Edit fallback — see getEditCatalogFromDB).
const ALWAYS_AVAILABLE_CATEGORIES: Record<string, string[]> = {
  "Living Room": ["Lamps", "Throws"],
  "Dining Room": ["Tabletop"],
  Bedroom: ["Lighting"],
  "Home Office": ["Lighting"],
};

// Powers the "smart-linked" priority-piece quiz question: once a material
// is chosen (step 3, right before priority piece at step 4), this tells the
// quiz which priority pieces actually have real inventory for that room +
// material combination, so the piece list never offers something like "A
// statement table" (Coffee Tables) for a material that has zero coffee
// tables at any price — that's a dead-end category, not just a dead-end
// budget tier. Lighting and "The table setting" are always kept: both
// override whatever material was picked and route to a universal/
// cross-material edit (see getEditCatalogFromDB), so they're never a dead
// end regardless of material.
export async function getAvailablePriorityTitles(room: string, material: string): Promise<Set<string>> {
  const options = getPriorityOptions(room);
  const available = new Set<string>();
  const alwaysAvailable = new Set(ALWAYS_AVAILABLE_CATEGORIES[room] || []);

  let materialKey = resolveMaterialKey(material);
  if (room === "Bedroom" || room === "Home Office") {
    materialKey = materialKey === "Walnut" ? "Walnut" : "Oak";
  }

  const presentCategories = new Set<string>();
  const { data, error } = await supabase
    .from("products")
    .select("category, name")
    .eq("room", room)
    .in("material", materialValues(materialKey))
    .eq("is_active", true);
  if (!error && data) {
    for (const row of data as { category: string; name: string }[]) presentCategories.add(tabLabelFor(row, room));
  }

  // Living Room's Walnut/Oak paths swap in each other's Side Tables tab —
  // check the complementary material for that one tab too.
  if (room === "Living Room" && (materialKey === "Walnut" || materialKey === "Oak")) {
    const complementKey = materialKey === "Walnut" ? "Oak" : "Walnut";
    const { data: compData } = await supabase
      .from("products")
      .select("category, name")
      .eq("room", room)
      .in("material", materialValues(complementKey))
      .eq("is_active", true);
    if (compData) {
      for (const row of compData as { category: string; name: string }[]) {
        if (tabLabelFor(row, room) === "Side Tables") presentCategories.add("Side Tables");
      }
    }
  }

  for (const opt of options) {
    const isLighting = opt.title.toLowerCase().includes("lighting");
    const isTableSetting = opt.title.toLowerCase().includes("table setting");
    if (isLighting || isTableSetting || alwaysAvailable.has(opt.category) || presentCategories.has(opt.category)) {
      available.add(opt.title);
    }
  }

  return available;
}

// Merges the Throws tab into a Living Room result set from any material
// path (Walnut, Oak, Stone, or the catch-all fallback) so it always shows as
// a supporting edit alongside whatever hero material was chosen. No-op for
// any other room — Throws is Living Room only for now.
async function withThrows(base: ProductGroup, room: string, budget?: string): Promise<ProductGroup> {
  if (room !== "Living Room") return base;
  const throwRows = await fetchView("natural_materials_living_room");
  const throwsGrouped = groupByTab(throwRows, "Living Room", budget);
  return { ...base, Throws: throwsGrouped["Throws"] || [] };
}

// Marble/Stone has real Dining Tables but no real dining chairs of its own
// yet. Rather than leave the "Dining Chairs" tab empty, Liz's call was to
// curate a mix of real chairs pulled from Natural Fibers, Oak, and
// Walnut's Dining Room seating — same spirit as the Throws merge below, just
// pulling from three materials instead of one. Stone/Marble-specific; remove
// once real marble/stone dining chairs are sourced.
async function withStoneDiningChairs(base: ProductGroup, budget?: string): Promise<ProductGroup> {
  const [naturalRows, oakRows, walnutRows] = await Promise.all([
    fetchRoomMaterialRows("Dining Room", "Natural Fibers"),
    fetchRoomMaterialRows("Dining Room", "Oak"),
    fetchRoomMaterialRows("Dining Room", "Walnut"),
  ]);
  const seatingRows = [...naturalRows, ...oakRows, ...walnutRows].filter(
    (r) => r.category === "Seating" || r.category === "Accents"
  );
  const grouped = groupByTab(seatingRows, "Dining Room", budget);
  return { ...base, "Dining Chairs": grouped["Dining Chairs"] || [] };
}

// Merges the Lamps tab into a Living Room result for any material path
// that doesn't already have one. Walnut and Oak already get Lamps via
// their own cross-material mix below; this covers Stone, Natural Fibers,
// and Chrome, which previously had no Lamps data at all — the tab
// didn't just come up empty, it silently disappeared from the results page
// entirely since Living Room's tab bar only shows tabs with a data key.
async function withLamps(base: ProductGroup, room: string, budget?: string): Promise<ProductGroup> {
  if (room !== "Living Room" || base["Lamps"]) return base;
  const grouped = groupByTab(await fetchView("the_light_edit"), "Living Room", budget);
  return { ...base, "Lamps": grouped["Lamps"] || [] };
}

// Merges the Tabletop tab (plates, napkins, tablecloths) into every Dining
// Room result regardless of chosen priority — mirrors the Throws merge in
// Living Room. Previously Tabletop only ever appeared when the priority was
// literally "The table setting"; now it always shows as a supporting edit
// alongside whatever hero category (Dining Tables/Dining Chairs) was chosen.
async function withTabletop(base: ProductGroup, budget?: string): Promise<ProductGroup> {
  const tabletopRows = filterByBudget(await fetchTabletopEdit(), budget).map(toProduct);
  return { ...base, Tabletop: tabletopRows };
}

// Ensures every tab a room is supposed to show (per ROOM_TABS in lib/rooms)
// is present in the result, even with zero matching products. Previously, a
// category with no rows was simply absent from the object, which made it
// vanish from the results-page tab bar — and worse, could silently redirect
// the "hero" tab to whatever else happened to have data (e.g. Walnut +
// Bedroom, with no real Walnut bedroom inventory yet, defaulted its hero to
// Lighting even when the user's priority was "The bedframe"). Now every
// expected tab always shows, and an empty one renders a "coming soon" /
// notify-me state (see EmptyTabNotify) instead of disappearing.
function fillRoomTabs(group: ProductGroup, room: string): ProductGroup {
  const filled: ProductGroup = { ...group };
  for (const tab of getRoomTabs(room)) {
    if (!filled[tab]) filled[tab] = [];
  }
  return filled;
}

export async function getMaterialProductsFromDB(material: string, room: string, budget?: string): Promise<ProductGroup> {
  const isDining = room === "Dining Room";
  if (material.toLowerCase().includes("walnut")) {
    const grouped = groupByTab(await fetchView(isDining ? "walnut_dining_room" : "walnut_living_room"), room, budget);
    return withThrows(grouped, room, budget);
  }
  if (material.toLowerCase().includes("oak")) {
    const grouped = groupByTab(await fetchView(isDining ? "oak_dining_room" : "oak_living_room"), room, budget);
    return withThrows(grouped, room, budget);
  }
  if (material.toLowerCase().includes("stone") || material.toLowerCase().includes("marble")) {
    if (isDining) {
      // Real Stone/Marble Dining Room inventory now exists (the marble
      // pedestal dining tables) — use it directly instead of the old Oak
      // dining-table fallback. No real marble dining chairs yet, so a
      // curated cross-material mix fills the supporting Dining Chairs tab
      // (see withStoneDiningChairs).
      const grouped = groupByTab(await fetchRoomMaterialRows("Dining Room", "Stone"), "Dining Room", budget);
      return withStoneDiningChairs(grouped, budget);
    }
    const grouped = await withThrows(groupByTab(await fetchView("stone_living_room"), "Living Room", budget), "Living Room", budget);
    return withLamps(grouped, "Living Room", budget);
  }
  if (material.toLowerCase().includes("linen") || material.toLowerCase().includes("natural")) {
    if (isDining) {
      // Real Dining Room Natural Fibers products exist (e.g. dining
      // seating) — use them directly instead of forcing Living Room.
      return groupByTab(await fetchRoomMaterialRows("Dining Room", "Natural Fibers"), "Dining Room", budget);
    }
    // Natural Fibers Living Room already includes the Throw-category rows
    // directly (same underlying view), so no separate Throws merge needed —
    // still needs Lamps merged in, though.
    const grouped = groupByTab(await fetchView("natural_materials_living_room"), "Living Room", budget);
    return withLamps(grouped, "Living Room", budget);
  }
  // Accepts "chrome" (canonical) and "metal" (permanent alias), so a quiz
  // answer from either era routes to the same catalog.
  if (material.toLowerCase().includes("chrome") || material.toLowerCase().includes("metal")) {
    if (isDining) {
      return groupByTab(await fetchRoomMaterialRows("Dining Room", "Chrome"), "Dining Room", budget);
    }
    // Real Living Room Chrome inventory now exists (side tables) — use it
    // directly instead of forcing the Dining Room Chrome catalog.
    const grouped = await withThrows(
      groupByTab(await fetchRoomMaterialRows("Living Room", "Chrome"), "Living Room", budget),
      "Living Room",
      budget
    );
    return withLamps(grouped, "Living Room", budget);
  }
  // Ceramic is intentionally not handled here — it's a decor-only category
  // reachable from Browse Our Edit, not one of the quiz's material options,
  // so getMaterialProductsFromDB should never be called with it.
  const grouped = await withThrows(groupByTab(await fetchView("walnut_living_room"), "Living Room", budget), "Living Room", budget);
  return withLamps(grouped, "Living Room", budget);
}

export async function getEditCatalogFromDB(
  material: string,
  room: string,
  priority: string,
  budget?: string
): Promise<ProductGroup> {
  const isLighting = Boolean(priority && priority.toLowerCase().includes("lighting"));
  const isTableSetting = Boolean(priority && priority.toLowerCase().includes("table setting"));
  const isDining = room === "Dining Room";
  const isBedroom = room === "Bedroom";
  const isWalnut = Boolean(material && material.toLowerCase().includes("walnut"));
  const isOak = Boolean(material && material.toLowerCase().includes("oak"));

  if (isLighting) {
    // The Light Edit is a room-agnostic universal lighting collection —
    // always split into Lamps / Pendants regardless of chosen room.
    // Still merge in Throws when the actual room is Living Room, so picking
    // "Lighting" as the priority piece doesn't drop the supporting edit.
    const grouped = groupByTab(await fetchView("the_light_edit"), "Living Room", budget);
    const withLighting = await withThrows(grouped, room, budget);
    // Both tabs always show, even if the current budget filter happens to
    // leave one of them empty (e.g. neither pendant is tagged "Under
    // $200") — same reasoning as fillRoomTabs below: a tab disappearing
    // outright reads as "this edit has no pendants" rather than "none at
    // this budget," and EmptyTabNotify already renders a graceful
    // coming-soon state for the zero-results case.
    if (!withLighting["Lamps"]) withLighting["Lamps"] = [];
    if (!withLighting["Pendants"]) withLighting["Pendants"] = [];
    return withLighting;
  }

  if (isTableSetting) {
    // Same pattern as Lighting above: the table-setting pieces (plates,
    // napkins, tablecloths) span Ceramic and Natural Fibers, so this
    // priority overrides whatever material was chosen and pulls the whole
    // dining tabletop edit into one "Tabletop" tab instead of splitting it
    // by category.
    return { Tabletop: filterByBudget(await fetchTabletopEdit(), budget).map(toProduct) };
  }

  if (isBedroom) {
    const [bedroomRows, lightRows] = await Promise.all([
      fetchRoomMaterialRows("Bedroom", isWalnut ? "Walnut" : "Oak"),
      fetchView("the_light_edit"),
    ]);
    const grouped = groupByTab(bedroomRows, "Bedroom", budget);
    // No Bedroom-tagged Lighting product exists yet, so the Lighting tab
    // would otherwise always be empty. Fall back to the universal Light
    // Edit for that tab specifically — real Bedroom lighting products, if
    // added later, take priority since we only fill in when empty.
    if (!grouped["Lighting"] || grouped["Lighting"].length === 0) {
      grouped["Lighting"] = filterByBudget(lightRows, budget).map(toProduct);
    }
    return fillRoomTabs(grouped, room);
  }

  if (room === "Home Office") {
    const [officeRows, lightRows] = await Promise.all([
      fetchRoomMaterialRows("Home Office", isWalnut ? "Walnut" : "Oak"),
      fetchView("the_light_edit"),
    ]);
    const grouped = groupByTab(officeRows, "Home Office", budget);
    // Same fallback as Bedroom above: no Home Office-tagged Lighting product
    // exists, so this tab would otherwise always be empty for the Desk /
    // Seating / Storage priorities (picking "Lighting" as the priority never
    // reaches here — the isLighting branch at the top catches it first).
    // Real Home Office lighting, if added later, takes priority since we only
    // fill in when empty. Note the Light Edit rows are assigned straight to
    // the Lighting tab rather than passed through groupByTab: Home Office
    // keeps one combined Lighting tab, whereas groupByTab would split them
    // into Lamps / Pendants tabs this room doesn't have.
    if (!grouped["Lighting"] || grouped["Lighting"].length === 0) {
      grouped["Lighting"] = filterByBudget(lightRows, budget).map(toProduct);
    }
    return fillRoomTabs(grouped, room);
  }

  if (isDining) {
    const grouped = await withTabletop(await getMaterialProductsFromDB(material, room, budget), budget);
    return fillRoomTabs(grouped, room);
  }

  if (isWalnut) {
    const [walnutRows, oakRows, lightRows, throwRows] = await Promise.all([
      fetchView("walnut_living_room"),
      fetchView("oak_living_room"),
      fetchView("the_light_edit"),
      fetchView("natural_materials_living_room"),
    ]);
    const walnut = groupByTab(walnutRows, "Living Room", budget);
    const oak = groupByTab(oakRows, "Living Room", budget);
    const light = groupByTab(lightRows, "Living Room", budget);
    const throws = groupByTab(throwRows, "Living Room", budget);
    return fillRoomTabs(
      {
        "Coffee Tables": walnut["Coffee Tables"] || [],
        "Side Tables": oak["Side Tables"] || [],
        Seating: walnut["Seating"] || [],
        "Lamps": light["Lamps"] || [],
        Throws: throws["Throws"] || [],
      },
      room
    );
  }

  if (isOak) {
    const [oakRows, walnutRows, lightRows, throwRows] = await Promise.all([
      fetchView("oak_living_room"),
      fetchView("walnut_living_room"),
      fetchView("the_light_edit"),
      fetchView("natural_materials_living_room"),
    ]);
    const oak = groupByTab(oakRows, "Living Room", budget);
    const walnut = groupByTab(walnutRows, "Living Room", budget);
    const light = groupByTab(lightRows, "Living Room", budget);
    const throws = groupByTab(throwRows, "Living Room", budget);
    return fillRoomTabs(
      {
        "Coffee Tables": oak["Coffee Tables"] || [],
        "Side Tables": walnut["Side Tables"] || [],
        Seating: oak["Seating"] || [],
        "Lamps": light["Lamps"] || [],
        Throws: throws["Throws"] || [],
      },
      room
    );
  }

  return fillRoomTabs(await getMaterialProductsFromDB(material, room, budget), room);
}

// Powers the "Browse Edits" landing page: every active product across all
// rooms, grouped first by material then by its tab-label category (same
// labels the results-page tabs use), regardless of room. Materials with no
// live products simply won't have a key.
export type BrowseCatalog = Record<string, ProductGroup>;
export type BrowseProduct = Product & { material: string; category: string };

const BROWSE_MATERIALS = ["Walnut", "Oak", "Stone", "Natural Fibers", "Chrome", "Ceramic", "Glass"];

type BrowseRow = {
  id: string;
  name: string;
  material: string;
  room: string | null;
  category: string;
  sort_order: number;
  affiliate_url: string | null;
};

async function fetchBrowseRows(): Promise<(BrowseRow & { images: string[]; label: string })[]> {
  // Lighting products are room/material-agnostic in Supabase (their
  // `material` column is null — see the_light_edit view/ALWAYS_AVAILABLE_
  // CATEGORIES), so they'd never match the `.in("material", BROWSE_
  // MATERIALS)` filter below. Fetch them separately by category instead,
  // and stamp a synthetic "Lighting" material label onto them so Browse Our
  // Edit can show Lighting as its own tag (with Lamps/Pendants sub-tags via
  // the existing browseTabLabelFor Lighting branch) alongside the real
  // per-material tags.
  const [materialsRes, lightingRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, material, room, category, affiliate_url, sort_order")
      .eq("is_active", true)
      .in("material", [...BROWSE_MATERIALS, LEGACY_MATERIAL_VALUE])
      .order("sort_order"),
    supabase
      .from("products")
      .select("id, name, material, room, category, affiliate_url, sort_order")
      .eq("is_active", true)
      .eq("category", "Lighting")
      .order("sort_order"),
  ]);

  if (materialsRes.error) console.error("Error fetching browse catalog:", materialsRes.error.message);
  if (lightingRes.error) console.error("Error fetching browse lighting rows:", lightingRes.error.message);

  const rows: BrowseRow[] = [
    // canonicalMaterial folds any "Metal"-tagged row into "Chrome" so it
    // matches the Chrome filter chip rather than showing up as an orphan
    // material with no chip of its own.
    ...(((materialsRes.data as BrowseRow[]) || [])).map((r) => ({
      ...r,
      material: canonicalMaterial(r.material),
    })),
    ...(((lightingRes.data as BrowseRow[]) || [])).map((r) => ({ ...r, material: "Lighting" })),
  ];

  if (rows.length === 0) return [];

  const ids = rows.map((p) => p.id);
  const { data: images, error: imgError } = await supabase
    .from("product_images")
    .select("product_id, image_url, sort_order")
    .in("product_id", ids)
    .eq("is_active", true)
    .order("sort_order");
  if (imgError) console.error("Error fetching browse catalog images:", imgError.message);

  const imagesByProduct = new Map<string, string[]>();
  (images || []).forEach((img: { product_id: string; image_url: string }) => {
    const list = imagesByProduct.get(img.product_id) || [];
    list.push(img.image_url);
    imagesByProduct.set(img.product_id, list);
  });

  const withImages = rows.map((p) => ({
    ...p,
    images: imagesByProduct.get(p.id) || [],
    label: browseTabLabelFor(p, p.room || "Living Room"),
  }));

  // Some products (e.g. a chair that fits both the Living Room and Dining
  // Room edits) intentionally have one row per room so each room's quiz
  // results can surface them — but that means the same physical product can
  // appear twice here, since Browse Our Edit spans every room. Dedupe by
  // name + affiliate link so each product shows once, keeping whichever row
  // sorts first.
  const seen = new Set<string>();
  const deduped: typeof withImages = [];
  for (const p of withImages) {
    const key = `${p.name.trim().toLowerCase()}|${p.affiliate_url || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(p);
  }
  return deduped;
}

// Grouped by material -> category label -> Product[]. Used where the browse
// experience is organized by material first (kept for potential reuse).
export async function getBrowseCatalog(): Promise<BrowseCatalog> {
  const rows = await fetchBrowseRows();
  const catalog: BrowseCatalog = {};
  for (const p of rows) {
    if (!catalog[p.material]) catalog[p.material] = {};
    if (!catalog[p.material][p.label]) catalog[p.material][p.label] = [];
    catalog[p.material][p.label].push({ name: p.name, link: p.affiliate_url || "#", images: p.images });
  }
  return catalog;
}

// Flat list of every active product across all materials, each tagged with
// its material and category label — powers the Browse Our Edit landing page
// (one mixed grid, filterable by tag).
export async function getBrowseProducts(): Promise<BrowseProduct[]> {
  const rows = await fetchBrowseRows();
  return rows.map((p) => ({
    name: p.name,
    link: p.affiliate_url || "#",
    images: p.images,
    material: p.material,
    category: p.label,
  }));
}
