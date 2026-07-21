# DevEvents

A hub for developer events — hackathons, meetups, and conferences, all in one place. Browse upcoming events, view details and similar events by tag, book a spot, or create a new event with an uploaded banner image.

**Live app:** https://dev-events-next-app-kohl-pi.vercel.app/

## Tech Stack

- **Next.js 16** (App Router, Turbopack, Cache Components / PPR)
- **TypeScript**
- **Supabase** — Postgres database, Auth, and Storage (event images)
- **Tailwind CSS v4** + **DaisyUI v5** (`winter` theme)
- **PostHog** — product analytics

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your-posthog-project-token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Run the database migrations in `supabase/migrations/` against your Supabase project (via the SQL Editor in the Supabase Dashboard, or `supabase db push` if you have the CLI linked) — they create the `events`, `bookings`, and `event_images` storage bucket, in that order.

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

## Deployment

Deployed on [Vercel](https://vercel.com/). When deploying, set the same environment variables listed above in the project's dashboard settings — `NEXT_PUBLIC_BASE_URL` should be the deployed domain, not `localhost`.
