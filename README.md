# The Interior Index

Next.js migration of the original single-file HTML prototype.

## What changed from the HTML version

- **Style quiz, results, and chat** are now React components (`components/`) with real state instead of DOM manipulation.
- **Product catalog now lives in Supabase, not in the code.** The site fetches products from the Supabase `products` / `product_images` tables at request time (`lib/supabaseClient.ts` → `lib/catalogData.ts`, with room/tab routing in `lib/rooms.ts`), so adding or editing a product is a data change — no rebuild or redeploy needed. `lib/catalog.ts` remains only for shared TypeScript types (`Product`, `ProductGroup`) and the results-page `profileMap` copy; it is no longer the product source. Quiz questions/options are still in `lib/quiz.ts`.
- **AI chat is now secure.** The old version called the Anthropic API directly from the browser, which would have exposed your API key to anyone who opened dev tools. Now the browser calls `/api/chat` (see `app/api/chat/route.ts`), which runs on the server and holds the real key in an environment variable.
- **Styling** is the same CSS as before, moved into `app/globals.css`, layered on top of Tailwind (used only for its reset — none of your visual design changed).

## Local development

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env template and add your real Anthropic API key:
   ```
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and paste in your key. This file is git-ignored and will never be pushed to GitHub.
3. Run the dev server:
   ```
   npm run dev
   ```
   Visit http://localhost:3000

## Deploying

1. Push this project to a GitHub repo (a fresh one, or replace the contents of your existing `theinteriorindex.com` repo).
2. Go to vercel.com, "Add New Project", import the repo.
3. In the Vercel project settings → Environment Variables, add:
   - `ANTHROPIC_API_KEY` = your real key
   - The site also needs its Supabase credentials (URL + anon key, see `lib/supabaseClient.ts`) and Resend email vars (e.g. `RESEND_FROM_EMAIL`) — check `.env.local.example` for the full current list.
4. Deploy. Vercel builds and hosts it automatically on every push to `main`.
5. Point your custom domain (theinteriorindex.com) at the Vercel project under Settings → Domains.

## Project structure

```
app/
  page.tsx                — top-level screen state (home / quiz / results / chat)
  layout.tsx              — fonts, metadata
  globals.css             — all styling
  browse/                 — standalone Browse Our Edit page
  results/                — quiz results route
  about/, privacy/, affiliate-disclosure/ — static pages
  api/chat/route.ts       — server-side Anthropic API proxy
  api/notify-me/route.ts  — "coming soon, notify me" waitlist (edit_waitlist)
  api/subscribe/route.ts  — email list signup
  api/send-list/route.ts  — email a saved product list
components/
  HomeScreen.tsx, HomeBrowsePreview.tsx
  QuizScreen.tsx
  ResultsScreen.tsx
  ChatScreen.tsx
  BrowseEditsScreen.tsx, BrowseProductCard.tsx  — Browse Our Edit grid + cards
  ProductCard.tsx         — image carousel for each product
  EmptyTabNotify.tsx      — inline "coming soon" state for empty tabs
  NotifyMeModal.tsx, SubscribeModal.tsx, EmailListModal.tsx — modals
  Footer.tsx, LegalShell.tsx
lib/
  supabaseClient.ts       — Supabase connection
  catalogData.ts          — fetches products from Supabase, builds room/material tabs
  rooms.ts                — room → tab and priority mappings
  retailer.ts             — retailer badge labels
  resultsUrl.ts           — results-page URL helpers
  catalog.ts              — shared types (Product, ProductGroup) + profileMap copy
  quiz.ts                 — quiz questions and options
```
