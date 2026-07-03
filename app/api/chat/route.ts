import { NextRequest, NextResponse } from "next/server";

// This route runs server-side only, so the API key never reaches the browser.
// Set ANTHROPIC_API_KEY in your Vercel project's Environment Variables
// (and in a local .env.local file for development — see .env.local.example).

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it in your environment variables." },
      { status: 500 }
    );
  }

  try {
    const { message, profileContext } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message' in request body." }, { status: 400 });
    }

    const systemPrompt = `You are The Interior Index AI — an editorial home decor design concierge with a minimalist, material-based curatorial philosophy. ${
      profileContext || ""
    } Your personality: Warm but precise. Editorial but accessible. You speak like a knowledgeable friend who works in interior design. Focus on minimalist home decor organized by material — walnut, oak, marble, linen, steel, resin, ceramic, concrete. Always reference specific material choices, mention finds are available on Amazon via The Interior Index, use editorial language, keep responses concise — 3-5 carefully chosen recommendations, never 10. Never sound generic.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "I'm having trouble responding right now. Please try again.";

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
