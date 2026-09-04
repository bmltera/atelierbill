"use client";

import { useState, useEffect } from "react";
import { engine, selectors } from "@/availability";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from "date-fns";
import Link from "next/link";
import { DayStatus } from "@/availability/types";
import { siteConfig } from "@/content/site";

export default function AvailabilityPage() {
  const [mounted, setMounted] = useState(false);
  const [months, setMonths] = useState<Date[]>([]);
  const now = new Date();

  useEffect(() => {
    setMounted(true);
    const m = [];
    for (let i = 0; i < 2; i++) {
      m.push(addMonths(now, i));
    }
    setMonths(m);
  }, []);

  if (!mounted) return <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 min-h-screen">Loading...</div>;

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-8 text-center">
        Availability
      </h1>
      <p className="text-center text-neutral-400 font-light mb-24 max-w-2xl mx-auto leading-relaxed">
        {siteConfig.availabilityText}
      </p>

      <div className="flex flex-col gap-24">
        {months.map((monthDate) => {
          const util = selectors.getMonthUtilization(monthDate.getFullYear(), monthDate.getMonth() + 1);
          const start = startOfMonth(monthDate);
          const end = endOfMonth(monthDate);
          const days = eachDayOfInterval({ start, end });
          
          // Pad start
          const startPadding = getDay(start); // 0 = Sunday
          
          return (
            <div key={monthDate.toISOString()}>
              <div className="flex justify-between items-end mb-8 border-b border-neutral-900 pb-4">
                <h2 className="text-3xl font-light tracking-widest uppercase">
                  {format(monthDate, "MMMM yyyy")}
                </h2>
                <div className="text-sm tracking-widest text-neutral-500 uppercase">
                  {util.percentageBooked}% Booked
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-4 mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <div key={d} className="text-center text-xs tracking-widest text-neutral-600 uppercase pb-2">
                    {d}
                  </div>
                ))}
                
                {Array.from({ length: startPadding }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {days.map(day => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const result = engine.getDayAvailability(dateStr);
                  
                  return (
                    <DayCell 
                      key={dateStr} 
                      date={day} 
                      status={result.status} 
                      remaining={result.remainingSlots}
                      label={result.label}
                      isPast={day < new Date(now.setHours(0,0,0,0))}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayCell({ date, status, remaining, label, isPast }: { date: Date, status: DayStatus, remaining: number, label?: string, isPast: boolean }) {
  if (isPast) {
    return (
      <div className="aspect-square flex flex-col items-center justify-center border border-neutral-900/50 opacity-30">
        <span className="text-lg font-light">{format(date, "d")}</span>
      </div>
    );
  }

  const isBookable = status === "available" || status === "limited";
  const statusColor = {
    available: "border-white/20 hover:border-white text-white",
    limited: "bg-amber-950/20 border-amber-900/40 hover:border-amber-700 text-amber-500",
    booked: "bg-neutral-900 border-neutral-800 text-neutral-600",
    unavailable: "bg-neutral-900 border-neutral-800 text-neutral-600",
    closed: "bg-neutral-900 border-neutral-800 text-neutral-600",
    travel: "bg-blue-950/20 border-blue-900/40 text-blue-500",
    tbd: "border-neutral-900 text-neutral-500",
  }[status];

  const displayStatus = status === "booked" ? "unavailable" : status;
  // Hide internal "Travel" and "Booked" labels from the public
  const finalLabel = (label === "Travel" || label === "Booked") ? "unavailable" : (label || displayStatus);
  const content = (
    <>
      <span className="text-lg md:text-xl font-light mb-0.5 md:mb-1">{format(date, "d")}</span>
      <span className="text-[7px] md:text-[10px] tracking-wide md:tracking-widest uppercase text-center px-0.5 w-full truncate">
        {finalLabel}
      </span>
    </>
  );

  const baseClasses = `aspect-square flex flex-col items-center justify-center border transition-colors ${statusColor}`;

  if (isBookable) {
    return (
      <Link href={`/book?date=${format(date, "yyyy-MM-dd")}`} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
}
