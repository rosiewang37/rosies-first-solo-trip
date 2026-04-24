# `src/data/` — trip data

## Purpose
The source of truth for trip content. Schedule, todos, recommendations. Plain TypeScript, no runtime dependencies.

## Entry points
`trip.ts` — exports `days: Day[]` (the 8-day Boston + NYC itinerary) and `todoSections: TodoSection[]` (pre-trip checklist).

## Types

```ts
Location   = { name, address, lat, lng }
Restaurant = Location & { why: string }   // why is a 1-sentence reason it's iconic

Block (discriminated union on `kind`):
  activity: { id, duration, title, details, locations: Location[],  tags }
  eat:      { id, duration, title, area,    areaCenter: {lat,lng}, picks: Restaurant[], tags }
  travel:   { id, duration, title, details, locations?: Location[], tags }
  free:     { id, duration, title, details, tags }

Day = { id, label, title, date, dateISO, city, startTime, blocks, optionalVisits: Location[], recommendations }
```

- `title` is the short phone-friendly label shown collapsed (e.g., "Freedom Trail, first half").
- `details` is the paragraph shown when the block is expanded.
- Every address that Rosie might want to navigate to gets its own `Location` with hardcoded `lat`/`lng`. Don't stuff multiple places in a single `Location.address` string — the UI will render one Google Maps link per entry, so concatenating breaks the link.
- `duration` is in minutes. The schedule timeline computes start/end times by summing durations starting from `Day.startTime`.
- `optionalVisits` are nearby spots for spare time. Same `Location` shape, rendered in a separate section under the day's schedule.

## Editing the schedule
1. Find the day's entry in `days[]`.
2. Add or edit a block in `blocks[]`. Set `kind` correctly.
3. For each place mentioned, add a `Location` (or `Restaurant`) entry with coordinates. Use Google Maps to look up lat/lng (right-click any spot, the coords appear at the top).
4. IDs must be unique across the whole file (they key localStorage checkboxes).

## Anti-patterns
- Don't concatenate addresses into one string.
- Don't add new fields as optional without updating `src/components/AGENTS.md` and `src/components/ScheduleBlock.tsx` — silent optional fields are easy to forget to render.
- Don't duplicate the same place across days with slightly different names. Use the same `name` string where possible so `pins.ts` can dedupe later if needed.
