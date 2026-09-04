import { AvailabilityEngine } from "./engine";
import { DateUtilization } from "./types";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWeekend } from "date-fns";

export class AvailabilitySelectors {
  constructor(private engine: AvailabilityEngine) {}

  public getRangeUtilization(startStr: string, endStr: string): DateUtilization {
    const days = eachDayOfInterval({ start: new Date(startStr), end: new Date(endStr) }).map((d) =>
      format(d, "yyyy-MM-dd")
    );

    let totalCapacity = 0;
    let bookedSlots = 0;

    for (const day of days) {
      const result = this.engine.getDayAvailability(day);
      if (result.capacity > 0) {
        totalCapacity += result.capacity;
        bookedSlots += (result.capacity - result.remainingSlots);
      }
    }

    const percentageBooked = totalCapacity > 0 ? (bookedSlots / totalCapacity) * 100 : 0;

    return {
      totalCapacity,
      bookedSlots,
      percentageBooked: Math.round(percentageBooked),
    };
  }

  public getWeekUtilization(dateStr: string): DateUtilization {
    const date = new Date(dateStr);
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    const end = format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    return this.getRangeUtilization(start, end);
  }

  public getMonthUtilization(year: number, month: number): DateUtilization {
    const date = new Date(year, month - 1); // 0-indexed month in JS Date
    const start = format(startOfMonth(date), "yyyy-MM-dd");
    const end = format(endOfMonth(date), "yyyy-MM-dd");
    return this.getRangeUtilization(start, end);
  }

  public getNextAvailableDates(fromDateStr: string, count: number): string[] {
    const availableDates: string[] = [];
    let currentDate = new Date(fromDateStr);

    // Hard limit to avoid infinite loops if no availability
    let limit = 0;
    while (availableDates.length < count && limit < 365) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const result = this.engine.getDayAvailability(dateStr);
      
      if (result.status === "available" || result.status === "limited") {
        availableDates.push(dateStr);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      limit++;
    }

    return availableDates;
  }
}
