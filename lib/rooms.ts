// Central room taxonomy: which category tabs each room shows, and what the
// "priority piece" quiz question offers per room. Add a new room here (and
// give it products with matching `room`/`category` values in Supabase) to
// extend the site to a new space.

export type RoomOption = { title: string; desc: string; category: string };

// Display-tab order per room. The first tab a user's priority piece maps to
// becomes the "hero" tab; the rest keep this relative order.
export const ROOM_TABS: Record<string, string[]> = {
  "Living Room": ["Coffee Tables", "Seating", "Side Tables", "Table Lamps"],
  "Dining Room": ["Dining Tables", "Dining Chairs", "Tabletop"],
  Bedroom: ["Bedframe", "Bench", "Side Tables", "Lighting"],
  "Home Office": ["Desk", "Seating", "Storage", "Lighting"],
};

// "Priority piece" options shown on quiz step 5, keyed by the room chosen in
// step 1. `category` is the tab (from ROOM_TABS above) that piece leads with
// on the results page.
export const PRIORITY_OPTIONS: Record<string, RoomOption[]> = {
  "Living Room": [
    { title: "A statement table", desc: "Coffee or side — the anchor piece", category: "Coffee Tables" },
    { title: "The perfect chair", desc: "Accent or reading — the character piece", category: "Seating" },
    { title: "Lighting", desc: "Floor lamp, pendant, or sconce — the mood piece", category: "Table Lamps" },
    { title: "Soft furnishings", desc: "Throws, cushions — the texture piece", category: "Table Lamps" },
  ],
  "Dining Room": [
    { title: "A statement table", desc: "The anchor piece your dining room is built around", category: "Dining Tables" },
    { title: "The perfect chair", desc: "Dining chairs with real material character", category: "Dining Chairs" },
    { title: "Lighting", desc: "Pendant or chandelier over the table — the mood piece", category: "Dining Tables" },
    { title: "The table setting", desc: "Plates, napkins, and the finishing touches — the setting piece", category: "Tabletop" },
  ],
  Bedroom: [
    {
      title: "The bedframe",
      desc: "The anchor piece — sets the scale, proportion, and material tone for the whole room",
      category: "Bedframe",
    },
    {
      title: "A bench",
      desc: "End-of-bed seating, layering space for throws, and quiet storage — the finishing piece",
      category: "Bench",
    },
    {
      title: "Side tables",
      desc: "Nightstands for lighting, books, and the everyday essentials within reach — the functional piece",
      category: "Side Tables",
    },
    {
      title: "Lighting",
      desc: "Table lamps or sconces — the soft, ambient glow that makes a bedroom feel restful",
      category: "Lighting",
    },
  ],
  "Home Office": [
    { title: "The desk", desc: "The anchor piece — where the work happens", category: "Desk" },
    { title: "The perfect chair", desc: "Seating that holds up all day", category: "Seating" },
    { title: "Storage", desc: "Shelving and cabinets — the organizing piece", category: "Storage" },
    { title: "Lighting", desc: "Task lighting for focus", category: "Lighting" },
  ],
};

export function getRoomTabs(room: string): string[] {
  return ROOM_TABS[room] || ROOM_TABS["Living Room"];
}

export function getPriorityOptions(room: string): RoomOption[] {
  return PRIORITY_OPTIONS[room] || PRIORITY_OPTIONS["Living Room"];
}

// Maps a chosen priority-piece title back to its hero category, for the
// results page tab ordering.
export function getPriorityCategory(room: string, priorityTitle: string): string | undefined {
  const opt = getPriorityOptions(room).find((o) => o.title === priorityTitle);
  return opt?.category;
}
