# `src/lib/` — pure helpers

## Purpose
Pure functions and thin localStorage wrappers. No React, no JSX, no external network calls. Things here are easily testable with Vitest.

## Entry points
| File | Exports | What it does |
|---|---|---|
| `schedule.ts` | `parseTimeString`, `formatTime`, `computeBlockTimes`, `mapsUrl` | Time parsing for the schedule timeline. `mapsUrl(address)` returns a single-address Google Maps link. Always pass one address at a time, never a concatenated string. |
| `clock.ts` | `getNow`, `findActiveBlock` | Real-time helper. `getNow(override)` reads the `?now=` query param if present, otherwise `new Date()`. `findActiveBlock` walks the days and returns which block is currently active based on `Day.startTime + Block.duration` math. |
| `storage.ts` | `getChecks`, `setChecks` | LocalStorage wrapper keyed by `'trip-checks'`. Returns `Record<string, boolean>`. SSR-safe (returns `{}` on the server). |
| `pins.ts` | `getCheckedPins` | Walks `days` and returns `Pin[]` for every checked-off location, restaurant, or optional visit. Consumed by `MapsView.tsx`. |

## Testing
Everything here has (or should have) a `*.test.ts` sibling. Run `npx vitest run`.

## Anti-patterns
- No React imports. If you need a hook, that belongs in `src/components/` or a future `src/hooks/`.
- No reading `window` or `localStorage` outside `storage.ts`. If SSR is a concern, gate with `typeof window === 'undefined'`.
- Don't inline constants that should be in `src/data/trip.ts`. This folder is logic; data belongs with data.

## Adding a helper
If the function is used in two places and is pure, it belongs here. If it's used in one place and short, inline it in the component.
