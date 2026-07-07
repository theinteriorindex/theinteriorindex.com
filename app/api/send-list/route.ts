import { NextRequest, NextResponse } from "next/server";
import type { ProductGroup } from "@/lib/catalog";

// This route runs server-side only, so the Resend API key never reaches the
// browser. Set RESEND_API_KEY in your Vercel project's Environment Variables
// (and in a local .env.local file for development — see .env.local.example).
//
// Sign up free at https://resend.com, grab an API key, and set RESEND_FROM_EMAIL
// once you've verified theinteriorindex.com as a sending domain there. Until
// then this falls back to Resend's shared test address, which only works for
// emails sent to the account you signed up with.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL || "The Interior Index <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing RESEND_API_KEY. Add it in your environment variables." },
      { status: 500 }
    );
  }

  try {
    const { to, editLabel, orderedTabs, products } = (await req.json()) as {
      to?: string;
      editLabel?: string;
      orderedTabs?: string[];
      products?: ProductGroup;
    };

    if (!to || typeof to !== "string" || !EMAIL_RE.test(to)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!orderedTabs || orderedTabs.length === 0 || !products) {
      return NextResponse.json({ error: "Missing curated list to send." }, { status: 400 });
    }

    const label = editLabel || "Curated Edit";
    const html = buildEmailHtml(label, orderedTabs, products);

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to,
        subject: `Your ${label} — The Interior Index`,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: `Email service error: ${errText}` }, { status: resp.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

const COLORS = {
  bark: "#3A2518",
  terracotta: "#A0714F",
  clay: "#C4A882",
  cream: "#F5F0E8",
  warmWhite: "#FAF7F2",
  linen: "#D4C9B8",
  textMid: "#6B5A4E",
};

// First tab is the "hero" — the priority piece the visitor chose in the quiz.
// Every other tab follows underneath as the rest of the edit, mirroring the
// products-tabs order shown on the results page itself.
function buildEmailHtml(editLabel: string, orderedTabs: string[], products: ProductGroup): string {
  const sections = orderedTabs.map((tab, i) => renderSection(tab, products[tab] || [], i === 0)).join("");

  return `
  <div style="background:${COLORS.warmWhite}; padding:32px 16px; font-family: Georgia, serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background:${COLORS.warmWhite};">
      <tr>
        <td style="background:${COLORS.bark}; padding:32px; text-align:center;">
          <div style="letter-spacing:0.2em; text-transform:uppercase; font-size:14px; color:${COLORS.cream};">The Interior <span style="font-style:italic; color:${COLORS.clay};">Index</span></div>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 8px 8px;">
          <div style="font-family: Arial, sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${COLORS.terracotta}; margin-bottom:8px;">Your curated edit</div>
          <div style="font-size:26px; color:${COLORS.bark}; margin-bottom:8px;">${escapeHtml(editLabel)}</div>
        </td>
      </tr>
      ${sections}
      <tr>
        <td style="padding:24px 8px 0; border-top:1px solid ${COLORS.linen}; margin-top:24px;">
          <div style="font-family: Arial, sans-serif; font-size:11px; color:${COLORS.textMid}; font-style:italic; padding-top:16px;">
            This edit contains affiliate links. Purchasing through these links supports The Interior Index at no additional cost to you.
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}

function renderSection(tab: string, items: ProductGroup[string], isFirst: boolean): string {
  if (!items || items.length === 0) return "";
  const rows = items.map(renderRow).join("");
  return `
    <tr>
      <td style="padding: 8px;">
        <div style="font-family: Arial, sans-serif; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:${COLORS.terracotta}; margin: ${
          isFirst ? "0" : "28px"
        } 0 14px; ${isFirst ? "" : `padding-top:20px; border-top:1px solid ${COLORS.linen};`}">
          ${isFirst ? "Start here — " : ""}${escapeHtml(tab)}
        </div>
        ${rows}
      </td>
    </tr>`;
}

function renderRow(p: { name: string; link: string; images: string[] }): string {
  const img = p.images?.[0];
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
      <tr>
        <td width="80" style="padding-right:16px; vertical-align:top;">
          ${
            img
              ? `<img src="${img}" width="80" height="107" style="object-fit:cover; display:block; background:${COLORS.linen};" alt="${escapeHtml(
                  p.name
                )}" />`
              : `<div style="width:80px; height:107px; background:${COLORS.linen};"></div>`
          }
        </td>
        <td style="vertical-align:top;">
          <div style="font-size:15px; color:${COLORS.bark}; margin-bottom:6px; line-height:1.35;">${escapeHtml(p.name)}</div>
          <a href="${p.link}" style="font-family: Arial, sans-serif; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:${
            COLORS.terracotta
          }; text-decoration:none; border-bottom:1px solid ${COLORS.terracotta}; padding-bottom:2px;">Shop on Amazon →</a>
        </td>
      </tr>
    </table>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
