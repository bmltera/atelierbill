import { AvailabilityConfig } from "./types";

export const availabilityConfig: AvailabilityConfig = {
  timezone: "America/Los_Angeles",

  display: {
    monthsAhead: 4,
    showBookedPercentage: true,
    showRemainingSlots: true,
    showWeekSummary: true,
    showMonthSummary: true,
    showExactDayStatuses: true,
  },

  limits: {
    maxBookingsPerWeek: 4,
    maxBookingsPerWeekend: 3,
  },
  
  defaultStatus: "unavailable",

  statusThresholds: {
    available: 0,
    limited: 0.5,
    booked: 1,
  },
};
