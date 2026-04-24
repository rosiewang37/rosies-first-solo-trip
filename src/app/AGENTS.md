# `src/app/` — routing and page composition

## Purpose
Next.js App Router routes. Each folder is a URL segment, `page.tsx` is the route handler. Pages compose components from `src/components/`, pull data from `src/data/`, and wire up state.

## Entry points
- `layout.tsx` — root layout, global CSS, fonts.
- `page.tsx` — landing page (currently a minimal placeholder).
- `trips/page.tsx` — trip index listing.
- `trips/boston-nyc/page.tsx` — the main planner. Has tab state, check state, now/next override. This is where most user interaction flows through.

## How the trip page works
Tabs are: `overview`, `maps`, one per day (`day1`–`day8`), and `todos`. Active tab is local state, reset to "today's day" on mount if the current date matches a trip day. Check state is read from `localStorage` on mount and written back on every toggle.

## Anti-patterns
- No business logic in this folder. If you're writing a function that takes data and returns data, put it in `src/lib/`.
- No direct `localStorage` reads in page components outside the existing mount-effect pattern in `trips/boston-nyc/page.tsx`. Add helpers to `src/lib/storage.ts` instead.
- Don't fetch external data in page components. This site is fully static.

## When to add a new route
Making a new trip page? Copy `trips/boston-nyc/page.tsx` as a starting point, swap in its own data module, and keep the tab structure consistent so future agents (and Rosie) can predict the layout.
