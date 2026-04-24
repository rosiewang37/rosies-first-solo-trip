# `src/components/` — presentation

## Purpose
Stateless (or near-stateless) UI. Components take props, render DOM. They don't fetch, don't read storage directly, don't own business logic.

## Entry points
| File | What it renders |
|---|---|
| `Nav.tsx` | Tab bar across the top |
| `DayView.tsx` | One day's schedule: blocks stacked vertically plus the optional-visits section |
| `ScheduleBlock.tsx` | A single time-block. Collapsed by default; expand to see sub-locations or restaurant picks with per-place Google Maps links and sub-checkboxes. Handles all `Block.kind` variants. |
| `CustomSpots.tsx` | User-added spots (extra restaurants inside an eat block, extra stops under optional visits). Input field + Add button. Each spot gets a checkbox, a Google Maps search link on its name, and an × remove button. Filters `customs` by `parent`. |
| `NowBar.tsx` | Live "Now / Next" indicator shown on the active day |
| `ProgressBar.tsx` | Todo-list progress bar |
| `TodoList.tsx` | Pre-trip / day-of / packing checklist tab |
| `MapsView.tsx` | Leaflet maps for Boston + NYC with pins for checked-off places. Dynamically imported with `ssr: false` because Leaflet touches `window`. |

## Patterns
- Receive state as props (`checks: Record<string, boolean>`), emit changes via callbacks (`onToggle(id, checked)`). The page owns the state.
- Sub-items (a location inside an activity, a restaurant inside an eat block, an optional visit) use `${block.id}:${sub.address}` or `${day.id}:opt:${addr}`. Keep the convention consistent so `src/lib/pins.ts` can aggregate correctly.
- Expand/collapse state for a block is local (`useState`), not persisted. Check state is persisted.

## Anti-patterns
- No `localStorage` access here. If you need a piece of persisted state, lift it to the page and pass it down.
- No data fetching. No API calls.
- Don't import from `src/data/trip.ts` directly unless you're rendering that data. Types are fine to import; data should flow through props.

## Adding a component
Small first. If it's only used in one place, inline it. Factor out only when reuse actually appears.
