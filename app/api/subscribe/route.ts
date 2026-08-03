import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// General newsletter signup — the "Subscribe" corner button on Browse Our
// Edit (and anywhere else it gets reused). Distinct from /api/notify-me,
// which is scoped to a specific not-yet-live material's waitlist; this one
// just captures an email into public.newsletter_subscribers (insert-only
// for anon via RLS, see the create_newsletter_subscribers migration) and
// sends a lightweight confirmation via Resend.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, source, firstName, lastName } = (await req.json()) as {
      email?: string;
      source?: string;
      firstName?: string;
      lastName?: string;
    };

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Names are optional (the landing nav dropdown sends them; the
    // SubscribeModal on Results/Browse doesn't) — normalise to null, cap
    // length so the columns can't be abused as a free-text dump.
    const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : null);

    const { error: dbError } = await supabase.from("newsletter_subscribers").insert({
      email,
      source: source || null,
      first_name: clean(firstName),
      last_name: clean(lastName),
    });
    // Ignore duplicate-signup conflicts (unique on lower(email)) — still
    // send the confirmation so it feels like it worked.
    if (dbError && dbError.code !== "23505") {
      console.error("Error saving newsletter signup:", dbError.message);
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
          subject: "You're on the list — The Interior Index",
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
                    <div style="font-family: Arial, sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#A0714F; margin-bottom:8px;">You're in</div>
                    <div style="font-size:24px; color:#3A2518; margin-bottom:16px;">Welcome to the Edit</div>
                    <div style="font-family: Arial, sans-serif; font-size:14px; color:#6B5A4E; line-height:1.7;">
                      New material edits, curated finds, and the occasional round-up — straight to your inbox, no spam.
                    </div>
                  </td>
                </tr>
              </table>
            </div>`,
        }),
      });
      // A failed confirmation email shouldn't fail the whole signup — the
      // subscriber row is already saved either way.
      if (!resp.ok) console.error("Subscribe confirmation email failed:", await resp.text());
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

