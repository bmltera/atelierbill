import { AvailabilityEngine } from "./engine";
import { AvailabilitySelectors } from "./selectors";
import { availabilityConfig } from "./config";
import { defaultSchedule, overrides, ranges, bookings } from "./overrides";

// Singleton instance for the static export
export const engine = new AvailabilityEngine(
  availabilityConfig,
  defaultSchedule,
  overrides,
  ranges,
  bookings
);

export const selectors = new AvailabilitySelectors(engine);

export * from "./types";
export * from "./config";
export * from "./overrides";
export * from "./engine";
export * from "./selectors";
