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
      { title: "Linen & Natural Textiles", desc: "Soft, tactile, calming" },
    ],
  },
  {
    id: "budget",
    num: "Question 04",
    title: "What's your budget for the hero piece?",
    sub: "We'll find options that deliver the look at the right price.",
    options: [
      { title: "Under $200", desc: "Amazon finds that punch above their weight" },
      { title: "$200 — $500", desc: "Mid-range with real material quality" },
      { title: "$500 — $1,000", desc: "Investment pieces worth the price" },
      { title: "$1,000+", desc: "Heirloom quality, no compromise" },
    ],
  },
  {
    id: "priority",
    num: "Question 05",
    title: "What's the one piece you need most?",
    sub: "We'll lead with this in your curated edit.",
    options: [
      { title: "A statement table", desc: "Coffee, dining, or side — the anchor piece" },
      { title: "The perfect chair", desc: "Accent, dining, or reading — the character piece" },
      { title: "Lighting", desc: "Floor lamp, pendant, or sconce — the mood piece" },
      { title: "Soft furnishings", desc: "Bedding, throws, or cushions — the texture piece" },
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
  natural: { title: "Linen & Natural Textiles", desc: "Soft, tactile, calming" },
  metal: { title: "Metal & Sculptural Forms", desc: "Cool, tactile, sculptural accents" },
} satisfies Record<string, QuizOption>;
type MaterialKey = keyof typeof MATERIAL_OPTIONS;

// Each aesthetic surfaces exactly 4 of the 5 materials — trimmed to whichever
// one reads tonally off for that direction, so Question 03 always feels
// consistent with the Question 02 answer instead of listing every material.
const MATERIALS_BY_AESTHETIC: Record<string, MaterialKey[]> = {
  "Wabi-Sabi": ["walnut", "oak", "stone", "natural"], // Metal reads too polished/industrial for Wabi-Sabi
  Japandi: ["oak", "stone", "natural", "metal"], // Walnut reads too heavy/traditional for Japandi
  "Organic Modern": ["oak", "stone", "natural", "metal"],
  "Quiet Luxury": ["oak", "stone", "natural", "metal"],
};
const DEFAULT_MATERIAL_KEYS: MaterialKey[] = ["walnut", "oak", "stone", "natural"];

function getMaterialOptions(aesthetic?: string): QuizOption[] {
  const keys = (aesthetic && MATERIALS_BY_AESTHETIC[aesthetic]) || DEFAULT_MATERIAL_KEYS;
  return keys.map((k) => MATERIAL_OPTIONS[k]);
}

// Room-aware and aesthetic-aware version of `questions`: step 5 ("priority
// piece") options change based on which room was chosen in step 1, and step
// 3 ("material palette") options change based on the aesthetic chosen in
// step 2, so each question stays tailored to what's already been answered.
export function getQuestions(room?: string, aesthetic?: string): QuizQuestion[] {
  return questions.map((q) => {
    if (q.id === "priority") return { ...q, options: getPriorityOptions(room || "Living Room") };
    if (q.id === "material") return { ...q, options: getMaterialOptions(aesthetic) };
    return q;
  });
}
