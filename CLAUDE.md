# CLAUDE.md — Alex's Treehouse

> This file gives you everything you need to work on this project. Read it before writing any code.

---

## Project Overview

**Alex's Treehouse** is an emotionally intelligent anti-procrastination web app for Indian college students. It helps users stop fighting themselves and start working — through a mind dump AI, a focus timer with a body double (Alex), and a treehouse of mementos earned by completing sessions.

The emotional core: Alex is a warm companion, not a productivity tool. The app should never feel clinical or corporate.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (TypeScript strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (new york variant) |
| Backend | Supabase (Postgres + Auth + Storage + pgvector) |
| AI — Mind Dump | `claude-sonnet-4-6` via Anthropic SDK |
| AI — Alex Chat (free tier) | `gemini-2.5-flash-lite` via Google AI (OpenAI-compatible) |
| AI — Alex Chat (paid tier) | `claude-haiku-4-5` via Anthropic SDK |
| AI — Embeddings | `text-embedding-004` via Google AI |
| Hosting | Cloudflare Workers (via `@cloudflare/next-on-pages`) |
| Image Storage | Cloudflare R2 |
| Payments | Razorpay (₹399 one-time upgrade) |
| Analytics | PostHog |
| Error Monitoring | Sentry |

---

## Architecture Rules

1. **No API keys in client code — ever.** All AI calls, Razorpay calls, and R2 operations go through `/api/` server routes only.
2. **Supabase Row Level Security on every table.** Users can only read/write their own rows. Test RLS before shipping any table.
3. **Tiered LLM routing is the moat.** Free → Gemini Flash-Lite. Paid → Claude Haiku. Both use the same Alex system prompt. The router lives in `/api/alex/chat`.
4. **Streaming responses only for Alex chat.** Use `ReadableStream` and stream tokens to the client. Never wait for full completion.
5. **Optimistic UI.** Task CRUD and subtask toggles update the UI instantly before the Supabase call confirms.
6. **Offline-first for Focus Timer.** Timer state lives in `localStorage`. Sessions are queued in IndexedDB if offline, synced on reconnect.
7. **Cloudflare R2 signed URLs are server-side only.** Never expose R2 credentials or unsigned URLs to the client.

---

## Design System

### Colours
```
--cream:           #FAF6F0   (background, main)
--cream-dark:      #F0EAE0   (card backgrounds, dividers)
--terracotta:      #D4856B   (primary accent, headings, CTA)
--terracotta-dark: #B86E55   (hover states)
--forest:          #5C7053   (success, "Start Session", positive actions)
--forest-dark:     #4A5C43   (forest hover)
--warm-brown:      #8B7355   (secondary text, borders)
--soft-text:       #6B6356   (body text)
--foreground:      #2D2D2D   (headings, strong text)
```

### Typography
- **Headings:** `Playfair Display` (Google Fonts, serif) via `--font-playfair`
- **Body:** `Geist Sans` via `--font-geist-sans`
- **Code/mono:** `Geist Mono`

### Tone
- Warm, not chirpy
- Calm, not preachy
- Like a slightly older friend who has been there
- Never shame, never moralize, never use motivational-poster language
- Alex says "yaar" sparingly and naturally

---

## File Map

```
alexs-treehouse/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata
│   ├── globals.css             # Design tokens, animations
│   ├── page.tsx                # Landing/coming-soon page (→ marketing page in Week 4)
│   ├── (auth)/
│   │   ├── login/page.tsx      # Sign-in form (Week 5)
│   │   └── signup/page.tsx     # Sign-up form (Week 5)
│   ├── onboarding/page.tsx     # 3-step wizard (Week 4)
│   ├── tasks/page.tsx          # Mind Dump + task list (Week 3–7)
│   ├── focus/page.tsx          # Focus timer (Week 8)
│   ├── treehouse/page.tsx      # Mementos grid (Week 11)
│   ├── upgrade/page.tsx        # Razorpay checkout (Week 10)
│   └── api/
│       ├── mind-dump/route.ts  # POST: Claude Sonnet parses raw text → tasks (Week 6)
│       ├── alex/
│       │   └── chat/route.ts   # POST: tiered LLM router, streaming (Week 9)
│       ├── embed/route.ts      # POST: Gemini text-embedding-004 (Week 10)
│       └── razorpay/
│           ├── create-order/route.ts  # POST: create Razorpay order (Week 10)
│           ├── verify/route.ts        # POST: verify payment signature (Week 10)
│           └── webhook/route.ts       # POST: HMAC-verify + upgrade user (Week 10)
├── components/
│   ├── nav/BottomNav.tsx       # Fixed bottom nav, mobile-first (Week 2)
│   ├── tasks/
│   │   ├── MindDumpInput.tsx   # Textarea + submit (Week 3/6)
│   │   ├── TaskCard.tsx        # Task + subtasks, inline edit (Week 7)
│   │   └── EmptyState.tsx      # Warm empty state (Week 7)
│   ├── focus/
│   │   ├── FocusTimer.tsx      # Countdown, wake lock, Web Audio (Week 8)
│   │   └── QuitEarlyFlow.tsx   # Alex body double (Week 12)
│   ├── treehouse/
│   │   ├── MementoCard.tsx     # Individual memento (Week 11)
│   │   └── MementoDetail.tsx   # Slide-up detail sheet (Week 11)
│   └── alex/
│       └── AlexChat.tsx        # Slide-up chat sheet, streaming (Week 9)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client (for API routes)
│   ├── ai/
│   │   ├── anthropic.ts        # Anthropic SDK singleton
│   │   ├── google.ts           # Google AI SDK singleton
│   │   └── alex-prompt.ts      # Alex system prompt (single source of truth)
│   └── utils.ts                # Shared helpers
├── middleware.ts                # Auth guard: redirects to /login if not signed in
├── CLAUDE.md                   # ← you are here
└── AGENTS.md                   # Shared rules for all AI agents
```

---

## Environment Variables

```bash
# .env.local — never commit this file

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never NEXT_PUBLIC_

# Anthropic (server-only)
ANTHROPIC_API_KEY=                # starts with sk-ant-

# Google AI (server-only)
GOOGLE_AI_API_KEY=

# Razorpay (server-only)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Cloudflare R2 (server-only)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# PostHog (public, safe)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry (public, safe)
NEXT_PUBLIC_SENTRY_DSN=
```

**Rule:** If a variable does NOT have `NEXT_PUBLIC_` prefix, it must NEVER appear in any client component, page, or `use client` file.

---

## Database Schema (Supabase)

```sql
-- profiles
create table profiles (
  user_id uuid references auth.users primary key,
  name text,
  study_time_preference text check (study_time_preference in ('morning','afternoon','night')),
  tier text default 'free' check (tier in ('free','paid')),
  onboarding_completed boolean default false,
  created_at timestamptz default now()
);

-- tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  status text default 'active' check (status in ('active','done')),
  due_date date,
  created_at timestamptz default now()
);

-- subtasks
create table subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks on delete cascade not null,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- focus_sessions
create table focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  task_id uuid references tasks,
  planned_duration_minutes int not null,
  actual_duration_minutes int,
  completed boolean default false,
  tab_away_count int default 0,
  ended_early_reason text,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- mementos
create table mementos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  image_url text,
  story_text text,
  source_session_id uuid references focus_sessions,
  seed text,
  created_at timestamptz default now()
);

-- user_memories (for Alex persistent memory)
create table user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  embedding vector(768),
  memory_type text,
  importance_score float,
  created_at timestamptz default now()
);

-- payments (idempotency log)
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  razorpay_payment_id text unique not null,
  razorpay_order_id text,
  amount int,
  status text,
  created_at timestamptz default now()
);
```

RLS: **Every table has RLS enabled. Every table has a policy: `user_id = auth.uid()`.**

---

## Key Gotchas

- **Cloudflare Workers ≠ Node.js.** Don't use `fs`, `path`, or any Node built-ins in route handlers. Use Web APIs only.
- **Supabase region:** Mumbai (`ap-south-1`) — always. Low latency from India.
- **Razorpay KYC** takes 1–3 business days. Start it in Week 10.
- **Never put HMAC logic in client code.** Razorpay webhook verification must use the official Razorpay SDK server-side.
- **shadcn/ui components** must use the `new york` variant. Init with: `npx shadcn@latest init` → select "new york".
- **Tailwind v4** uses `@import "tailwindcss"` not `@tailwind base/components/utilities`.
- **pgvector dimension is 768** (Gemini `text-embedding-004`), not 1536.

---

## Alex System Prompt (reference)

Alex is a warm companion for Indian college students fighting procrastination.
- Tone: warm not chirpy, calm not preachy, like a slightly older friend
- Responses: 1–3 sentences by default
- Never shame, never moralize, never motivational-poster language
- Uses "we" and "let's" naturally; says "yaar" sparingly
- When user wants to quit focus: validate first → offer smaller step → respect choice
- If user expresses serious distress: gently mention **iCall (9152987821)** or **AASRA (9820466627)**
