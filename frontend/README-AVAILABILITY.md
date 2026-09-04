# Availability System Guide

The scheduling logic is decoupled from the UI. It calculates your availability based on rules, limits, and manual overrides.

## Core Configuration (`src/availability/config.ts`)

### `defaultSchedule`
Defines your normal weekly capacity. If a day has `capacity: 2`, it means you can take 2 shoots.
If you only want to work weekends, disable weekdays:
```ts
friday: { enabled: false, capacity: 0 },
saturday: { enabled: true, capacity: 2 },
sunday: { enabled: true, capacity: 2 },
```

### `limits`
Controls the maximum number of shoots in a week/weekend regardless of individual day capacities.
Example: I can work Sat/Sun (capacity 2 each = 4 total slots), but I only want to take 3 shoots maximum per weekend.
```ts
limits: {
  maxBookingsPerWeek: 4,
  maxBookingsPerWeekend: 3,
}
```

### `display`
Controls what the public sees:
```ts
showExactRemainingSlots: true, // Show "1 of 2 slots left"
showBookedPercentage: true,    // Show "50% booked"
```

## Manual Overrides (`src/availability/overrides.ts`)

### Example A: Block Vacation
Use `ranges` to block a period.
```ts
export const ranges = [
  { start: "2026-12-18", end: "2027-01-03", status: "unavailable", publicLabel: "Travel" }
];
```

### Example B: Special Weekday Opening
Normally unavailable Wednesday, but want to open 1 slot:
```ts
export const overrides = [
  { date: "2026-09-23", status: "available", capacity: 1, reason: "Special Opening" }
];
```

### Example C: Reduce Capacity for a Date
Normally Saturday has 2 slots, but you only want to do 1 this weekend:
```ts
export const overrides = [
  { date: "2026-09-19", capacity: 1 }
];
```

## Adding Bookings (`src/availability/overrides.ts`)
Add items to the `bookings` array to decrement remaining slots and increase booked percentage:
```ts
export const bookings = [
  { date: "2026-09-12", quantity: 1 }
];
```
