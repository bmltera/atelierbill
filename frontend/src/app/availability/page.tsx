"use client";

import { useState, useEffect } from "react";
import { engine, selectors } from "@/availability";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import Link from "next/link";
import { DayStatus } from "@/availability/types";

export default function AvailabilityPage() {
  const [mounted, setMounted] = useState(false);
  const [months, setMonths] = useState<Date[]>([]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  useEffect(() => {
    setMounted(true);
    const m = [];
    for (let i = 0; i < 2; i++) {
      m.push(addMonths(now, i));
    }
    setMonths(m);
  }, []);

  if (!mounted) return <div className="pt-32 pb-24 max-w-[1200px] mx-auto px-8 md:px-12 min-h-screen" />;

  return (
    <div className="pt-32 pb-24 max-w-[900px] mx-auto px-8 md:px-12 w-full">
      <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.25em] uppercase mb-20 text-center text-white/90">
        Availability
      </h1>

      <div className="flex flex-col gap-20">
        {months.map((monthDate) => {
          const start = startOfMonth(monthDate);
          const end = endOfMonth(monthDate);
          const days = eachDayOfInterval({ start, end });
          const startPadding = getDay(start);
          
          return (
            <div key={monthDate.toISOString()}>
              <h2 className="text-lg md:text-xl font-extralight tracking-[0.2em] uppercase text-white/60 mb-8 pb-4 border-b border-white/[0.06]">
                {format(monthDate, "MMMM yyyy")}
              </h2>

              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[9px] tracking-[0.15em] text-white/25 uppercase pb-3">
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
                      isPast={day < today}
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
      <div className="aspect-square flex flex-col items-center justify-center">
        <span className="text-sm md:text-base font-light text-white/10">{format(date, "d")}</span>
      </div>
    );
  }

  const isBookable = status === "available" || status === "limited";
  const statusStyle = {
    available: "border-white/[0.08] text-white/70 hover:text-white hover:border-white/25",
    limited: "border-amber-800/20 text-amber-500/60 hover:text-amber-400/80 hover:border-amber-700/30",
    booked: "text-white/20",
    unavailable: "text-white/20",
    closed: "text-white/20",
    travel: "text-white/20",
    tbd: "text-white/20",
  }[status];

  const displayStatus = status === "booked" ? "unavailable" : status;
  const finalLabel = (label === "Travel" || label === "Booked") ? "unavailable" : (label || displayStatus);
  
  const content = (
    <>
      <span className="text-sm md:text-base font-light">{format(date, "d")}</span>
      <span className="text-[7px] md:text-[8px] tracking-[0.1em] uppercase opacity-50 mt-0.5 truncate max-w-full px-0.5">
        {finalLabel}
      </span>
    </>
  );

  const baseClasses = `aspect-square flex flex-col items-center justify-center border border-transparent rounded-sm transition-colors duration-200 ${statusStyle}`;

  if (isBookable) {
    return (
      <Link href={`/book?date=${format(date, "yyyy-MM-dd")}`} className={`${baseClasses} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40`}>
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
