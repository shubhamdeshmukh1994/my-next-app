# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` using Next.js 15.3+ instrumentation, with a reverse proxy (`/ingest`), exception autocapture, and debug mode in development.
- **`next.config.js`**: Added PostHog reverse-proxy rewrites (`/ingest/static/*`, `/ingest/array/*`, `/ingest/*`) and `skipTrailingSlashRedirect: true` to route analytics through the Next.js origin and avoid ad-blockers.
- **`app/login/page.tsx`**: Captures `user_logged_in` and calls `posthog.identify()` on successful login; captures `user_login_failed` with the error message on failure.
- **`app/signup/page.tsx`**: Captures `user_signed_up` and calls `posthog.identify()` with the Supabase user ID on successful signup.
- **`app/componants/Header.tsx`**: Calls `posthog.identify()` on page load for already-authenticated users; captures `user_logged_out` and calls `posthog.reset()` before signing out.
- **`app/componants/ExploreBtn.tsx`**: Captures `explore_events_clicked` when the Explore Events button is clicked.
- **`app/componants/EventCard.tsx`**: Converted to a client component and captures `event_card_clicked` with `event_slug`, `event_title`, and `event_location` properties when a card is clicked.
- **`app/componants/AddToCart.tsx`**: Captures `add_to_cart_clicked` when the Add to Cart button is clicked.
- **`app/users/page.tsx`**: Captures `user_record_created` or `user_record_updated` (with `user_id`) after a successful form submit, and `user_record_deleted` (with `user_id`) after a confirmed delete.
- **`app/api/users/create-user/route.ts`** (bug fix): Renamed `get` → `GET` to conform to Next.js App Router HTTP method naming, which was preventing the production build.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully completes sign up via Supabase auth. | `app/signup/page.tsx` |
| `user_logged_in` | Fired when a user successfully signs in with email and password. | `app/login/page.tsx` |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or other error. | `app/login/page.tsx` |
| `user_logged_out` | Fired when the authenticated user clicks the logout button in the header. | `app/componants/Header.tsx` |
| `explore_events_clicked` | Fired when a visitor clicks the Explore Events button on the home page. | `app/componants/ExploreBtn.tsx` |
| `event_card_clicked` | Fired when a visitor clicks on an event card to view its details. | `app/componants/EventCard.tsx` |
| `add_to_cart_clicked` | Fired when a user clicks the Add to Cart button. | `app/componants/AddToCart.tsx` |
| `user_record_created` | Fired when an admin successfully creates a new user record in the users table. | `app/users/page.tsx` |
| `user_record_updated` | Fired when an admin successfully updates an existing user record. | `app/users/page.tsx` |
| `user_record_deleted` | Fired when an admin confirms and deletes a user record from the users table. | `app/users/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/516876/dashboard/1864849)
- [New signups over time (wizard)](https://us.posthog.com/project/516876/insights/idgeYyHR)
- [Login to signup conversion funnel (wizard)](https://us.posthog.com/project/516876/insights/kDia4c5I)
- [User management actions (wizard)](https://us.posthog.com/project/516876/insights/00TJqyou)
- [Login failure rate (wizard)](https://us.posthog.com/project/516876/insights/88T8YAVR)
- [Event exploration engagement (wizard)](https://us.posthog.com/project/516876/insights/B7UOhs9c)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the Header component already does this on mount, but verify the flow works correctly after a session refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
