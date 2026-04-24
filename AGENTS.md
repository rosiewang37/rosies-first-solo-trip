<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo map (for agents)

This is Rosie's personal site. The first (and currently only) feature is an interactive Boston + NYC trip planner at `/trips/boston-nyc`. Everything is TypeScript, React 19, Next.js 16 App Router, deployed to Vercel.

## Where things live

| You want to... | Go here |
|---|---|
| Change the trip schedule, add a block, add a restaurant | `src/data/trip.ts` |
| Change how a schedule block renders | `src/components/ScheduleBlock.tsx` |
| Add or change a tab on the trip page | `src/app/trips/boston-nyc/page.tsx` |
| Add a new utility helper (pure functions) | `src/lib/` (pick an existing file if the helper fits, otherwise new file) |
| Change the Boston/NYC pin map | `src/components/MapsView.tsx` + `src/lib/pins.ts` |
| Change styling | `src/app/globals.css` (no Tailwind, no CSS modules) |
| Add a new trip page (e.g. Paris) | New folder under `src/app/trips/`, copy the `boston-nyc` pattern |

Each folder inside `src/` has its own `AGENTS.md` describing its purpose, entry points, and anti-patterns. Read the one closest to the file you're editing.

## Data shape in one paragraph

`src/data/trip.ts` exports `days: Day[]`. Each `Day` has `blocks: Block[]` (the scheduled timeline) and `optionalVisits: Location[]` (extra nearby spots for spare time). A `Block` is a discriminated union on `kind`: `'activity'` (sightseeing with one or more `locations`), `'eat'` (eating time in a named `area` with `picks: Restaurant[]`), `'travel'` (transit), or `'free'` (rest). Every `Location` and `Restaurant` has its own `{name, address, lat, lng}` so each renders as a separate Google Maps link.

## Persistence and state

- Checkbox state (what Rosie has visited) lives in `localStorage` via `src/lib/storage.ts`. Keys are free-form strings; sub-items use `${block.id}:${sub.address}`, optional visits use `${day.id}:opt:${addr}`.
- Custom user-added spots (restaurants inside eat blocks, stops under optional visits) live separately in `localStorage` via `src/lib/customs.ts` as a list of `{ id, name, parent }`. The `id` is also used as a checkbox key so the same `checks` record toggles them. Custom items don't appear on the pin map (no coords).
- Live "now / next" indicator uses real time unless `?now=2026-04-28T14:00` query param overrides it (see `src/lib/clock.ts`).
- No backend. No session cookies. No auth.

## Dependencies to know about

- `leaflet` + `react-leaflet` for the pin map (OpenStreetMap tiles, no API key).
- `vitest` for unit tests (`npx vitest run`).
- No Tailwind, no CSS-in-JS, no state manager. Keep it that way unless there's a concrete reason.

## Anti-patterns

- Don't read `localStorage` from inside a component. The page passes `checks` down and `onToggle` up.
- Don't put business logic in `src/app/`. Routes compose; helpers live in `src/lib/`; data lives in `src/data/`.
- Don't concatenate multiple addresses into one string. Each place Rosie might want to navigate to gets its own `Location` entry so the Maps link works for that one place.
- Don't add dependencies without explaining the tradeoff in the commit message.
