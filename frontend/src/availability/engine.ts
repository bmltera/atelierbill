import {
  AvailabilityConfig,
  AvailabilityOverride,
  AvailabilityRange,
  AvailabilityBooking,
  DayStatus,
  AvailabilityResult,
} from "./types";
import { parseISO, format, getDay, isWithinInterval, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend } from "date-fns";

export class AvailabilityEngine {
  constructor(
    private config: AvailabilityConfig,
    private defaultSchedule: any, // We'll cast/type this properly 
    private overrides: AvailabilityOverride[],
    private ranges: AvailabilityRange[],
    private bookings: AvailabilityBooking[]
  ) {}

  public getDayAvailability(dateStr: string): AvailabilityResult {
    const date = parseISO(dateStr);
    
    // 1. Manual Date Override
    const manualOverride = this.overrides.find((o) => o.date === dateStr);
    if (manualOverride && manualOverride.status) {
      return {
        date: dateStr,
        status: manualOverride.status,
        capacity: manualOverride.capacity ?? 0,
        remainingSlots: 0, // When status is manually forced, we might not track remaining accurately, or default to 0
        label: manualOverride.reason,
      };
    }

    // 2. Date Range Override (search backwards so latest override takes precedence)
    const rangeOverride = [...this.ranges].reverse().find(
      (r) => dateStr >= r.start && dateStr <= r.end
    );
    if (rangeOverride && !manualOverride) {
      return {
        date: dateStr,
        status: rangeOverride.status,
        capacity: 0,
        remainingSlots: 0,
        label: rangeOverride.publicLabel,
      };
    }

    // Determine base capacity for the day
    let baseCapacity = 0;
    let enabled = false;

    if (manualOverride && manualOverride.capacity !== undefined) {
      baseCapacity = manualOverride.capacity;
      enabled = manualOverride.enabled !== false;
    } else {
      const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
      const defaultSchedule = this.getDefaultScheduleForDay(dayOfWeek);
      enabled = defaultSchedule.enabled;
      baseCapacity = defaultSchedule.capacity;
    }

    if (!enabled) {
      return {
        date: dateStr,
        status: this.config.defaultStatus,
        capacity: 0,
        remainingSlots: 0,
      };
    }

    // 3. Weekly & Weekend Limits
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) => format(d, "yyyy-MM-dd"));
    
    const weekBookings = weekDays.reduce((acc, d) => acc + this.getBookingCount(d), 0);
    const weekendDays = weekDays.filter((d) => isWeekend(parseISO(d)));
    const weekendBookings = weekendDays.reduce((acc, d) => acc + this.getBookingCount(d), 0);

    const isWeekendDay = isWeekend(date);

    let maxAllowedByLimits = baseCapacity;

    if (this.config.limits.maxBookingsPerWeek !== null) {
      const remainingWeekly = Math.max(0, this.config.limits.maxBookingsPerWeek - weekBookings + this.getBookingCount(dateStr));
      maxAllowedByLimits = Math.min(maxAllowedByLimits, remainingWeekly);
    }

    if (isWeekendDay && this.config.limits.maxBookingsPerWeekend !== null) {
      const remainingWeekend = Math.max(0, this.config.limits.maxBookingsPerWeekend - weekendBookings + this.getBookingCount(dateStr));
      maxAllowedByLimits = Math.min(maxAllowedByLimits, remainingWeekend);
    }

    const currentBookings = this.getBookingCount(dateStr);
    const remainingSlots = Math.max(0, maxAllowedByLimits - currentBookings);

    // Calculate Status
    let status: DayStatus = "available";
    const utilization = baseCapacity > 0 ? currentBookings / baseCapacity : 1;
    const dayOfWeek = getDay(date);
    const defaultStatus = this.getDefaultScheduleForDay(dayOfWeek).status;

    if (remainingSlots === 0 || utilization >= this.config.statusThresholds.booked) {
      status = "booked";
    } else if (currentBookings > 0 || utilization >= this.config.statusThresholds.limited) {
      status = "limited";
    } else if (defaultStatus) {
      status = defaultStatus;
    }

    // If limits force it to 0 capacity and it wasn't originally 0
    if (maxAllowedByLimits === 0 && baseCapacity > 0 && currentBookings === 0) {
       status = "unavailable";
    }

    return {
      date: dateStr,
      status,
      capacity: baseCapacity,
      remainingSlots,
    };
  }

  private getDefaultScheduleForDay(dayOfWeek: number) {
    switch (dayOfWeek) {
      case 0: return this.defaultSchedule.sunday;
      case 1: return this.defaultSchedule.monday;
      case 2: return this.defaultSchedule.tuesday;
      case 3: return this.defaultSchedule.wednesday;
      case 4: return this.defaultSchedule.thursday;
      case 5: return this.defaultSchedule.friday;
      case 6: return this.defaultSchedule.saturday;
      default: return { enabled: false, capacity: 0 };
    }
  }

  private getBookingCount(dateStr: string): number {
    return this.bookings
      .filter((b) => b.date === dateStr)
      .reduce((acc, b) => acc + b.quantity, 0);
  }
}
