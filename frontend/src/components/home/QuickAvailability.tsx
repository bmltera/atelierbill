"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, addDays } from "date-fns";
import { selectors } from "@/availability";
import { DateUtilization } from "@/availability/types";

export function QuickAvailability() {
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [monthUtil, setMonthUtil] = useState<DateUtilization | null>(null);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // Generate data on client to avoid hydration mismatch due to dates
    const now = new Date();
    const dates = selectors.getNextAvailableDates(format(now, "yyyy-MM-dd"), 3);
    setNextDates(dates);

    const util = selectors.getMonthUtilization(now.getFullYear(), now.getMonth() + 1);
    setMonthUtil(util);
    setCurrentMonth(format(now, "MMMM"));
  }, []);

  if (!monthUtil) return null;

  return (
    <section className="py-24 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          <div className="flex-1">
            <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-8">Availability</h2>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mb-8">
              <div>
                <div className="text-3xl md:text-5xl font-light mb-2 uppercase tracking-wide">
                  {currentMonth}
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/availability"
            className="group flex items-center gap-4 text-sm tracking-widest uppercase border-b border-neutral-700 pb-2 hover:border-white transition-colors"
          >
            View Schedule
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
