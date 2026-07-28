import { getPriorityOptions } from "./rooms";

export type QuizOption = { title: string; desc: string };
export type QuizQuestion = { id: string; num: string; title: string; sub: string; options: QuizOption[] };

export const questions: QuizQuestion[] = [
  {
    id: "room",
    num: "Question 01",
    title: "Which room are you focusing on?",
    sub: "We'll tailor your material edit to this space.",
    options: [
      { title: "Living Room", desc: "Sofas, coffee tables, accent chairs, lighting" },
      { title: "Dining Room", desc: "Tables, chairs, pendants, sideboards" },
      { title: "Bedroom", desc: "Beds, nightstands, wardrobes, bedding" },
      { title: "Home Office", desc: "Desks, shelving, task lighting, seating" },
    ],
  },
  {
    id: "aesthetic",
    num: "Question 02",
    title: "What aesthetic direction feels right?",
    sub: "Choose the one that speaks to how you want to live.",
    options: [
      { title: "Japandi", desc: "Japanese-Scandinavian — minimal, functional, natural" },
      { title: "Wabi-Sabi", desc: "Imperfect, organic, quietly beautiful" },
      { title: "Organic Modern", desc: "Clean lines softened by natural texture" },
      { title: "Quiet Luxury", desc: "Refined restraint, quality over quantity" },
    ],
  },
  {
    id: "material",
    num: "Question 03",
    title: "Which material palette draws you in?",
    sub: "Your primary material anchors the whole room.",
    // Overridden per-aesthetic by getMaterialOptions below — this static
    // list is just the fallback before Question 02 has been answered.
    options: [
      { title: "Walnut & Dark Wood", desc: "Warm, rich, sculptural" },
      { title: "Oak & Light Wood", desc: "Airy, Scandinavian, versatile" },
      { title: "Marble & Stone", desc: "Cool, refined, timeless" },
      { title: "Natural Fibers", desc: "Soft, tactile, calming" },
    ],
  },
  {
    id: "priority",
    num: "Question 04",
    title: "What's the one piece you need most?",
    sub: "We'll lead with this in your curated edit.",
    options: [
      { title: "A statement table", desc: "Coffee, dining, or side — the anchor piece" },
      { title: "The perfect chair", desc: "Accent, dining, or reading — the character piece" },
      { title: "Lighting", desc: "Floor lamp, pendant, or sconce — the mood piece" },
      { title: "Soft furnishings", desc: "Bedding, throws, or cushions — the texture piece" },
    ],
  },
  {
    id: "budget",
    num: "Question 05",
    title: "What's your budget for the hero piece?",
    sub: "We'll find options that deliver the look at the right price.",
    options: [
      { title: "Under $200", desc: "Amazon finds that punch above their weight" },
      { title: "$200 — $500", desc: "Mid-range with real material quality" },
      { title: "$500 — $1,000", desc: "Investment pieces worth the price" },
      { title: "$1,000+", desc: "Heirloom quality, no compromise" },
    ],
  },
];

// The five materials the quiz can offer, keyed for the per-aesthetic lookup
// below. Ceramic is deliberately not included here — it's a Browse Our Edit
// decor-only category, not a quiz-reachable "hero material".
const MATERIAL_OPTIONS = {
  walnut: { title: "Walnut & Dark Wood", desc: "Warm, rich, sculptural" },
  oak: { title: "Oak & Light Wood", desc: "Airy, Scandinavian, versatile" },
  stone: { title: "Marble & Stone", desc: "Cool, refined, timeless" },
  natural: { title: "Natural Fibers", desc: "Soft, tactile, calming" },
  chrome: { title: "Chrome & Sculptural Forms", desc: "Cool, tactile, sculptural accents" },
} satisfies Record<string, QuizOption>;
type MaterialKey = keyof typeof MATERIAL_OPTIONS;

// Each aesthetic surfaces exactly 4 of the 5 materials — trimmed to whichever
// one reads tonally off for that direction, so Question 03 always feels
// consistent with the Question 02 answer instead of listing every material.
const MATERIALS_BY_AESTHETIC: Record<string, MaterialKey[]> = {
  "Wabi-Sabi": ["walnut", "oak", "stone", "natural"], // Chrome reads too polished/industrial for Wabi-Sabi
  Japandi: ["oak", "stone", "natural", "chrome"], // Walnut reads too heavy/traditional for Japandi
  "Organic Modern": ["oak", "stone", "natural", "chrome"],
  "Quiet Luxury": ["oak", "stone", "natural", "chrome"],
};
const DEFAULT_MATERIAL_KEYS: MaterialKey[] = ["walnut", "oak", "stone", "natural"];

function getMaterialOptions(aesthetic?: string, room?: string): QuizOption[] {
  let keys = (aesthetic && MATERIALS_BY_AESTHETIC[aesthetic]) || DEFAULT_MATERIAL_KEYS;
  // Home Office has zero Marble/Stone inventory (its catalog fetch only
  // branches Walnut vs. Oak — see getEditCatalogFromDB — so picking Stone
  // silently falls through to Oak product data) but real Walnut inventory
  // (Desk, Storage) — swap Stone out for Walnut here specifically rather
  // than offering a material that's guaranteed to be a mislabeled duplicate
  // of Oak. Falls back to swapping in Chrome on the aesthetics that already
  // include Walnut alongside Stone (Wabi-Sabi, and the pre-Question-02
  // default), so the option count stays at 4 either way.
  if (room === "Home Office") {
    keys = keys.map((k) => (k === "stone" ? (keys.includes("walnut") ? "chrome" : "walnut") : k));
  }
  // Bedroom's real inventory is Walnut and Oak only (per Supabase) — its
  // catalog fetch, same as Home Office, only ever branches Walnut vs. Oak.
  // Chrome has zero Bedroom inventory too, so unlike Home Office it's never
  // swapped in as a Stone replacement — both Stone and Chrome collapse to
  // Walnut here, then get deduped. That means Bedroom shows 3 options
  // (Walnut, Oak, Natural) instead of 4, consistently across every
  // aesthetic, rather than surfacing a material guaranteed to be a
  // mislabeled duplicate of Oak.
  if (room === "Bedroom") {
    const mapped = keys.map((k) => (k === "stone" || k === "chrome" ? "walnut" : k));
    keys = Array.from(new Set(mapped)) as MaterialKey[];
  }
  return keys.map((k) => MATERIAL_OPTIONS[k]);
}

// Quiet Luxury's positioning ("refined restraint, quality over quantity")
// reads oddly next to "Under $200," and the real inventory in the default
// top tier ("$1,000+") actually spans ~$1,050 to ~$8,700 — a wide enough
// spread that lumping it into one option hides real price differentiation
// for a shopper who's already signaled they want the high end. So Quiet
// Luxury drops "Under $200" and splits "$1,000+" into two real tiers at the
// $2,500 mark instead (4 Quiet-Luxury-tagged products sit under that line,
// 5 sit above it — neither half is a dead end). Every other aesthetic (and
// the pre-Question-02 default) keeps the original four tiers unchanged.
// `filterByBudget` in catalogData.ts checks the real `price` column against
// $2,500 for these two options specifically, since Supabase's `budget_tier`
// column itself only ever has the coarse "$1,000+" value.
const DEFAULT_BUDGET_OPTIONS: QuizOption[] = [
  { title: "Under $200", desc: "Amazon finds that punch above their weight" },
  { title: "$200 — $500", desc: "Mid-range with real material quality" },
  { title: "$500 — $1,000", desc: "Investment pieces worth the price" },
  { title: "$1,000+", desc: "Heirloom quality, no compromise" },
];
const QUIET_LUXURY_BUDGET_OPTIONS: QuizOption[] = [
  { title: "$200 — $500", desc: "Mid-range with real material quality" },
  { title: "$500 — $1,000", desc: "Investment pieces worth the price" },
  { title: "$1,000 — $2,500", desc: "Heirloom quality, considered investment" },
  { title: "$2,500+", desc: "No compromise, the piece the room is built around" },
];

function getBudgetOptions(aesthetic?: string): QuizOption[] {
  return aesthetic === "Quiet Luxury" ? QUIET_LUXURY_BUDGET_OPTIONS : DEFAULT_BUDGET_OPTIONS;
}

// Room-aware, aesthetic-aware, and material-aware version of `questions`:
// step 3 ("material palette") options change based on the aesthetic chosen
// in step 2; once a material is picked, step 4 ("priority piece") is
// smart-linked to only the pieces that have real inventory for that room +
// material combination (via `availablePriorityTitles` — a piece like "A
// statement table" never gets offered for a material with zero coffee
// tables at any price, e.g. Natural Fibers). Step 5 ("budget
// range") shows all four tiers for every aesthetic except Quiet Luxury,
// which gets its own four via `getBudgetOptions` (see above). Passing
// `null`/`undefined` for availablePriorityTitles (e.g. the answer it
// depends on isn't set yet, or the lookup is still loading) leaves every
// priority option visible.
export function getQuestions(
  room?: string,
  aesthetic?: string,
  availablePriorityTitles?: Set<string> | null
): QuizQuestion[] {
  return questions.map((q) => {
    if (q.id === "material") return { ...q, options: getMaterialOptions(aesthetic, room) };
    if (q.id === "budget") return { ...q, options: getBudgetOptions(aesthetic) };
    if (q.id === "priority") {
      const options = getPriorityOptions(room || "Living Room");
      if (availablePriorityTitles) {
        const availableOnly = options.filter((o) => availablePriorityTitles.has(o.title));
        // Never leave the shopper with zero options to click — if nothing
        // matched, fall back to the full list rather than showing a dead end.
        if (availableOnly.length > 0) return { ...q, options: availableOnly };
      }
      return { ...q, options };
    }
    return q;
  });
}
