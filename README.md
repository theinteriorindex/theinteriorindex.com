# The Interior Index

Next.js migration of the original single-file HTML prototype.

## What changed from the HTML version

- **Style quiz, results, and chat** are now React components (`components/`) with real state instead of DOM manipulation.
- **Product catalog** lives in `lib/catalog.ts`, quiz questions in `lib/quiz.ts` — edit these to add/remove products or change quiz copy without touching layout code.
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
4. Deploy. Vercel builds and hosts it automatically on every push to `main`.
5. Point your custom domain (theinteriorindex.com) at the Vercel project under Settings → Domains.

## Project structure

```
app/
  page.tsx           — top-level screen state (home / quiz / results / chat)
  layout.tsx          — fonts, metadata
  globals.css         — all styling
  api/chat/route.ts   — server-side Anthropic API proxy
components/
  HomeScreen.tsx
  QuizScreen.tsx
  ResultsScreen.tsx
  ChatScreen.tsx
  ProductCard.tsx      — image carousel for each product
lib/
  catalog.ts           — all product data (edit here to update products)
  quiz.ts               — quiz questions and options
```
