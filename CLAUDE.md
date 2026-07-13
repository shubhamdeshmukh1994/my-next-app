# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint (eslint-config-next / core-web-vitals)
```

There is no test framework configured in this repo (no jest/vitest/playwright and no test script) — `npm run lint` and `npm run build` (which type-checks via `tsc`) are the only automated checks available.

Requires a `.env` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (read in `lib/supabase/client.ts`, `lib/supabase/server.ts`, and `middleware.ts`).

## Architecture

**Next.js App Router + Supabase.** Nearly every page under `app/` is a Client Component (`"use client"`) that calls the Supabase JS client directly from the browser rather than going through Server Actions or Route Handlers. There are no `route.ts` API handlers in this project — all reads/writes happen client-side.

**Two Supabase client entrypoints, use the right one:**
- `lib/supabase/client.ts` — `createBrowserClient`, for use in Client Components (`"use client"` pages/components).
- `lib/supabase/server.ts` — `createClient()` (async), uses `createServerClient` with `next/headers` `cookies()`. For Server Components/Server Actions only — do not import this from a Client Component.

**Auth enforcement lives in `middleware.ts`, not in React.** It calls `supabase.auth.getUser()` against the session cookie on every request, redirects unauthenticated users to `/login` unless the path is in `publicRoutes` (`/login`, `/signup`), and redirects authenticated users away from those public routes to `/dashboard`. This is the actual gate.
`app/componants/ClientAuthProvider.tsx` implements a second, unrelated auth scheme (a `localStorage` `auth-token` + route guard), but it is not imported anywhere (not wired into `app/layout.tsx` or any page), so it currently has no effect. Don't assume it's active; don't build on top of it without wiring it in first.

**Component directory is `app/componants/` (misspelled).** Existing imports (e.g. `app/dashboard/page.tsx`, `app/users/page.tsx`) reference this path — keep the spelling for consistency unless asked to rename it project-wide.

**Two separate notions of "user":**
- Supabase Auth's own `auth.users`, populated via `supabase.auth.signUp` / `signInWithPassword` (`app/signup/page.tsx`, `app/login/page.tsx`) and read via `supabase.auth.getUser()` (`app/componants/Header.tsx`).
- A separate `users` table in the Supabase database (name/dob/email/phone/password/image_url) managed entirely by `app/users/page.tsx`, which does full CRUD (insert/update/select/delete) directly against that table from the client, independent of the authenticated identity above. Profile images for these rows go through Supabase Storage bucket `user_images`, path pattern `private/{userId}.{ext}` (`uploadUserImage` in `app/users/page.tsx`).

**Styling:** Tailwind CSS + DaisyUI, theme fixed to `winter` (set via `data-theme="winter"` on `<html>` in `app/layout.tsx` and in `daisyui.themes` in `tailwind.config.ts`). `tailwind.config.ts` content globs include `./pages` and `./components`, but only `app/` currently exists/is used.

**Path alias:** `@/*` maps to the repo root (`tsconfig.json`), e.g. `@/lib/supabase/client`.
