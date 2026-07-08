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
    options: [
      { title: "Walnut & Dark Wood", desc: "Warm, rich, sculptural" },
      { title: "Oak & Light Wood", desc: "Airy, Scandinavian, versatile" },
      { title: "Marble & Stone", desc: "Cool, refined, timeless" },
      { title: "Linen & Natural Textiles", desc: "Soft, tactile, calming" },
      { title: "Metal & Sculptural Forms", desc: "Cool, tactile, sculptural accents" },
      { title: "Ceramic & Earthy Textures", desc: "Handcrafted, tactile, quietly organic" },
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

// Room-aware version of `questions`: step 5 ("priority piece") options
// change based on which room was chosen in step 1, so a Bedroom selection
// offers Bedframe/Bench/Side tables/Lighting instead of living-room pieces.
export function getQuestions(room?: string): QuizQuestion[] {
  return questions.map((q) => (q.id === "priority" ? { ...q, options: getPriorityOptions(room || "Living Room") } : q));
}
