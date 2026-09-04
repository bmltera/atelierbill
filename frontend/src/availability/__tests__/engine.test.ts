import { describe, it, expect } from "vitest";
import { AvailabilityEngine } from "../engine";
import { AvailabilityConfig } from "../types";

const mockConfig: AvailabilityConfig = {
  timezone: "America/Los_Angeles",
  display: {
    monthsAhead: 4,
    showBookedPercentage: true,
    showRemainingSlots: true,
    showWeekSummary: true,
    showMonthSummary: true,
    showExactDayStatuses: true,
  },
  defaultSchedule: {
    monday: { enabled: false, capacity: 0 },
    tuesday: { enabled: false, capacity: 0 },
    wednesday: { enabled: false, capacity: 0 },
    thursday: { enabled: false, capacity: 0 },
    friday: { enabled: true, capacity: 1 },
    saturday: { enabled: true, capacity: 2 },
    sunday: { enabled: true, capacity: 2 },
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

describe("AvailabilityEngine", () => {
  it("should return unavailable for disabled weekdays", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [], []);
    // 2026-09-02 is a Wednesday
    const result = engine.getDayAvailability("2026-09-02");
    expect(result.status).toBe("unavailable");
    expect(result.capacity).toBe(0);
  });

  it("should return available for enabled weekends with no bookings", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [], []);
    // 2026-09-05 is a Saturday
    const result = engine.getDayAvailability("2026-09-05");
    expect(result.status).toBe("available");
    expect(result.capacity).toBe(2);
    expect(result.remainingSlots).toBe(2);
  });

  it("should return booked when fully booked", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [], [
      { date: "2026-09-05", quantity: 2 }
    ]);
    const result = engine.getDayAvailability("2026-09-05");
    expect(result.status).toBe("booked");
    expect(result.remainingSlots).toBe(0);
  });

  it("should return limited when partially booked", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [], [
      { date: "2026-09-05", quantity: 1 }
    ]);
    const result = engine.getDayAvailability("2026-09-05");
    expect(result.status).toBe("limited");
    expect(result.remainingSlots).toBe(1);
  });

  it("should apply manual date overrides", () => {
    const engine = new AvailabilityEngine(mockConfig, [
      { date: "2026-09-02", status: "available", capacity: 1, reason: "Special Opening" }
    ], [], []);
    const result = engine.getDayAvailability("2026-09-02");
    expect(result.status).toBe("available");
    expect(result.capacity).toBe(1);
    expect(result.label).toBe("Special Opening");
  });

  it("should apply date range overrides", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [
      { start: "2026-09-04", end: "2026-09-06", status: "travel", publicLabel: "Travel" }
    ], []);
    
    // 2026-09-05 is inside the range
    const result = engine.getDayAvailability("2026-09-05");
    expect(result.status).toBe("travel");
    expect(result.capacity).toBe(0);
    expect(result.label).toBe("Travel");
  });

  it("should apply weekend capacity limits", () => {
    const engine = new AvailabilityEngine(mockConfig, [], [], [
      { date: "2026-09-05", quantity: 2 }, // Saturday: 2 bookings
      { date: "2026-09-06", quantity: 1 }  // Sunday: 1 booking (Total 3 weekend bookings)
    ]);
    
    // We already have 3 weekend bookings. The limit is 3. 
    // Sunday has capacity 2 normally, but we used 1. Since weekend limit is met, remaining slots should be 0.
    const resultSun = engine.getDayAvailability("2026-09-06");
    expect(resultSun.status).toBe("booked");
    expect(resultSun.remainingSlots).toBe(0);
  });
});
