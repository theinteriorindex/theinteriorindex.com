import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Captures "notify me" signups from the Browse Edits landing page for
// materials with no live catalog yet (Marble, Linen). Stores the email in
// Supabase (public.edit_waitlist — insert-only for anon via RLS, see the
// create_edit_waitlist migration) and sends a confirmation via Resend.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, material } = (await req.json()) as { email?: string; material?: string };

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!material || typeof material !== "string") {
      return NextResponse.json({ error: "Missing material." }, { status: 400 });
    }

    const { error: dbError } = await supabase.from("edit_waitlist").insert({ email, material });
    // Ignore duplicate-signup conflicts (unique on lower(email), material) —
    // still send the confirmation so it feels like it worked.
    if (dbError && dbError.code !== "23505") {
      console.error("Error saving waitlist signup:", dbError.message);
      return NextResponse.json({ error: "Could not save your signup. Please try again." }, { status: 500 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const fromAddress = process.env.RESEND_FROM_EMAIL || "The Interior Index <onboarding@resend.dev>";
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: fromAddress,
          to: email,
          subject: `You're on the list for The ${material} Edit — The Interior Index`,
          html: `
            <div style="background:#FAF7F2; padding:32px 16px; font-family: Georgia, serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; margin:0 auto; background:#FAF7F2;">
                <tr>
                  <td style="background:#3A2518; padding:32px; text-align:center;">
                    <div style="letter-spacing:0.2em; text-transform:uppercase; font-size:14px; color:#F5F0E8;">The Interior <span style="font-style:italic; color:#C4A882;">Index</span></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 8px;">
                    <div style="font-family: Arial, sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#A0714F; margin-bottom:8px;">You're on the list</div>
                    <div style="font-size:24px; color:#3A2518; margin-bottom:16px;">The ${material} Edit</div>
                    <div style="font-family: Arial, sans-serif; font-size:14px; color:#6B5A4E; line-height:1.7;">
                      We're still curating this edit. The moment it's live, you'll be the first to know.
                    </div>
                  </td>
                </tr>
              </table>
            </div>`,
        }),
      });
      // A failed confirmation email shouldn't fail the whole signup — the
      // waitlist row is already saved either way.
      if (!resp.ok) console.error("Notify-me confirmation email failed:", await resp.text());
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
