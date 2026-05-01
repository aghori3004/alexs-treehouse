# AGENTS.md — Shared AI Agent Rules for Alex's Treehouse

> These rules apply to ALL AI agents working on this project — Claude Code, Antigravity, Codex, Gemini, or any other tool. Read this before writing any code.

---

## What This Project Is

**Alex's Treehouse** — an emotionally intelligent anti-procrastination web app for Indian college students. The emotional core is the companion "Alex", not the features. If any code makes the experience feel clinical or corporate, it's wrong.

---

## Non-Negotiable Rules

### 1. Security
- **Zero API keys in client code.** No exceptions. All AI/Razorpay/R2 calls go through `/api/` server routes.
- `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `RAZORPAY_KEY_SECRET`, `R2_SECRET_ACCESS_KEY` are **never** prefixed with `NEXT_PUBLIC_`.
- Every Supabase table has **Row Level Security** enabled with `user_id = auth.uid()` policies.

### 2. Runtime Environment
- Deployed on **Cloudflare Workers** — no Node.js built-ins (`fs`, `path`, `crypto`, `os`). Use Web APIs only in route handlers.
- Do NOT use `next/headers` in client components. `cookies()` and `headers()` are server-only.

### 3. Code Style
- TypeScript strict mode — no `any`, no `// @ts-ignore` without a comment explaining why.
- All components are Server Components by default. Add `'use client'` only when you need browser APIs, event handlers, or React state/effects.
- File naming: `kebab-case` for files, `PascalCase` for components.
- No inline styles — use Tailwind utilities or CSS variables from `globals.css`.

### 4. Design System — Never Break These
```
Background:  #FAF6F0 (cream)
Primary:     #D4856B (terracotta) — headings, CTAs, accents
Success:     #5C7053 (forest green) — start session, positive actions
Text:        #6B6356 (soft-text), #2D2D2D (headings)
```
- Headings use `font-serif` (`Playfair Display`)
- Body uses `font-sans` (`Geist Sans`)
- The app should feel warm, calm, cozy — never cold, never stark white, never clinical grey.

### 5. AI Calls
- **Mind Dump:** `claude-sonnet-4-6` — parses messy text → structured tasks JSON
- **Alex Chat (free):** `gemini-2.5-flash-lite` via OpenAI-compatible endpoint
- **Alex Chat (paid):** `claude-haiku-4-5` via Anthropic SDK
- **Embeddings:** `text-embedding-004` (Google AI) → `vector(768)` in pgvector
- Always stream Alex responses — never wait for full completion.

### 6. Database
- Supabase project is in **Mumbai (`ap-south-1`)** region. Do not suggest changing this.
- Never run raw SQL in the app. Use Supabase client methods or typed queries.
- Always check if an operation needs `service_role` key (admin ops) vs `anon` key (user ops).

### 7. Payments
- Razorpay HMAC verification **must** use the official `razorpay` Node SDK — never write HMAC manually.
- Webhook handler must be idempotent — check `payments` table for duplicate `razorpay_payment_id` before updating user tier.

---

## What NOT To Do

- ❌ Don't suggest Vercel for hosting — we're on Cloudflare Workers. Vercel Hobby bans commercial use.
- ❌ Don't use `useState` + `useEffect` to fetch data — use Server Components or React Query.
- ❌ Don't add new npm packages without asking — check if the functionality is already available in the stack.
- ❌ Don't write motivational-sounding microcopy — Alex's tone is warm and grounded, not hype-y.
- ❌ Don't use `1536`-dimension vectors — Gemini embeddings are `768`.
- ❌ Don't use Tailwind v3 syntax (`@tailwind base`) — this project uses Tailwind v4 (`@import "tailwindcss"`).

---

## Deployment

```bash
# Preview locally
npm run dev

# Build check
npm run build

# Deploy (auto via git push to main)
git push origin main
# Cloudflare Workers auto-deploys from GitHub
```

Live URL: `https://alexs-treehouse.divyanshgangwar3004.workers.dev/`

---

## Next.js Version Note

This project uses **Next.js 16** (not 14 or 15). APIs, conventions, and file structure may differ from training data. Before writing route handlers, layouts, or middleware, check `node_modules/next/dist/docs/` if in doubt. Heed deprecation notices from the compiler.
