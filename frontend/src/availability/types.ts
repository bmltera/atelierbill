export type DayStatus = "available" | "limited" | "booked" | "unavailable" | "closed" | "travel" | "tbd";

export interface CapacityLimits {
  maxBookingsPerWeek: number | null;
  maxBookingsPerWeekend: number | null;
}

export interface DaySchedule {
  enabled: boolean;
  capacity: number;
  status?: DayStatus;
}

export interface DefaultSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface PublicDisplaySettings {
  monthsAhead: number;
  showBookedPercentage: boolean;
  showRemainingSlots: boolean;
  showWeekSummary: boolean;
  showMonthSummary: boolean;
  showExactDayStatuses: boolean;
}

export interface AvailabilityConfig {
  timezone: string;
  display: PublicDisplaySettings;
  limits: CapacityLimits;
  defaultStatus: DayStatus;
  statusThresholds: {
    available: number; // e.g. 0 bookings
    limited: number;   // e.g. 0.5 (50% capacity)
    booked: number;    // e.g. 1 (100% capacity)
  };
}

export interface AvailabilityOverride {
  date: string; // YYYY-MM-DD
  status?: DayStatus;
  capacity?: number;
  enabled?: boolean;
  reason?: string;
}

export interface AvailabilityRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  status: DayStatus;
  publicLabel?: string;
}

export interface AvailabilityBooking {
  date: string; // YYYY-MM-DD
  quantity: number;
  comment?: string;
}

export interface AvailabilityResult {
  date: string; // YYYY-MM-DD
  status: DayStatus;
  capacity: number;
  remainingSlots: number;
  label?: string; // Optional label e.g., "Travel"
}

export interface DateUtilization {
  totalCapacity: number;
  bookedSlots: number;
  percentageBooked: number;
}
