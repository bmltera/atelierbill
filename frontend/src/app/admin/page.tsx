"use client";

import { useState, useEffect } from "react";
import { 
  defaultSchedule as initialSchedule, 
  overrides as initialOverrides, 
  ranges as initialRanges, 
  bookings as initialBookings 
} from "@/availability/overrides";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWithinInterval, isSameDay } from "date-fns";
import { DayStatus } from "@/availability/types";

export default function AdminCalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [months, setMonths] = useState<Date[]>([]);
  
  // Data State
  const [schedule, setSchedule] = useState(initialSchedule);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [ranges, setRanges] = useState(initialRanges);
  const [bookings, setBookings] = useState(initialBookings);
  const [statusMsg, setStatusMsg] = useState("");

  // Drag Selection State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragHover, setDragHover] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: Date, end: Date } | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const m = [];
    for (let i = 0; i < 6; i++) {
      m.push(addMonths(now, i));
    }
    setMonths(m);
  }, []);

  const handleSave = async () => {
    setStatusMsg("Saving...");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultSchedule: schedule, overrides, ranges, bookings }),
      });
      if (res.ok) {
        setStatusMsg("Saved successfully! The site will hot-reload shortly.");
      } else {
        setStatusMsg("Failed to save.");
      }
    } catch (e) {
      setStatusMsg("Error saving.");
    }
  };

  const toggleDay = (day: keyof typeof schedule) => {
    const current = schedule[day];
    let nextState;
    
    // Cycle: Available -> Limited -> Unavailable -> Available
    if (current.enabled && current.status !== "limited") {
      // Move to Limited
      nextState = { enabled: true, capacity: 1, status: "limited" as const };
    } else if (current.enabled && current.status === "limited") {
      // Move to Unavailable
      nextState = { enabled: false, capacity: 0, status: undefined };
    } else {
      // Move to Available
      nextState = { enabled: true, capacity: 2, status: "available" as const };
    }
    
    setSchedule({
      ...schedule,
      [day]: nextState
    });
  };

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent, date: Date) => {
    setIsDragging(true);
    setDragStart(date);
    setDragHover(date);
    setSelectedRange(null);
    setMenuPos(null);
  };

  const handleMouseEnter = (date: Date) => {
    if (isDragging) {
      setDragHover(date);
    }
  };

  const handleMouseUp = (e: React.MouseEvent, date: Date) => {
    if (isDragging && dragStart) {
      setIsDragging(false);
      const start = dragStart < date ? dragStart : date;
      const end = dragStart > date ? dragStart : date;
      setSelectedRange({ start, end });
      setMenuPos({ x: e.clientX, y: e.clientY });
    }
  };

  const isDateSelected = (date: Date) => {
    if (isDragging && dragStart && dragHover) {
      const s = dragStart < dragHover ? dragStart : dragHover;
      const e = dragStart > dragHover ? dragStart : dragHover;
      return isWithinInterval(date, { start: s, end: e });
    }
    if (selectedRange) {
      return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
    }
    return false;
  };

  // Actions
  const replaceRange = (status: DayStatus, publicLabel: string) => {
    if (!selectedRange) return;
    const startStr = format(selectedRange.start, "yyyy-MM-dd");
    const endStr = format(selectedRange.end, "yyyy-MM-dd");

    // Remove exact matches so we can overwrite cleanly
    const filtered = ranges.filter(r => !(r.start === startStr && r.end === endStr));

    setRanges([
      ...filtered,
      { start: startStr, end: endStr, status, publicLabel }
    ]);
    setSelectedRange(null);
    setMenuPos(null);
  };

  const markVacation = () => replaceRange("unavailable", "Travel");
  const markLimited = () => replaceRange("limited", "Limited");
  const markBooked = () => replaceRange("booked", "Booked");
  const markUnavailable = () => replaceRange("unavailable", "Unavailable");

  const clearSelection = () => {
    if (!selectedRange) return;
    const s = selectedRange.start;
    const e = selectedRange.end;
    
    const dates = eachDayOfInterval({ start: s, end: e }).map(d => format(d, "yyyy-MM-dd"));
    
    // Remove from bookings
    setBookings(bookings.filter(b => !dates.includes(b.date)));
    
    // Remove from ranges if it completely matches or overlaps (simplified: just remove exact matches)
    setRanges(ranges.filter(r => !(r.start === format(s, "yyyy-MM-dd") && r.end === format(e, "yyyy-MM-dd"))));
    
    setSelectedRange(null);
    setMenuPos(null);
  };

  if (!mounted) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-6 w-full" onMouseUp={() => setIsDragging(false)}>
      <h1 className="text-4xl font-light tracking-widest uppercase mb-6">
        Interactive Admin
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-neutral-900/50 p-6 border border-neutral-800">
        <div>
          <h2 className="text-xl font-light uppercase tracking-wide mb-4">Default Weekly Schedule</h2>
          <div className="flex gap-2">
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => {
              const st = schedule[day];
              let btnClass = "bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600";
              let label = "NO";
              if (st.enabled) {
                if (st.status === "limited") {
                  btnClass = "bg-neutral-800 text-white border-neutral-600";
                  label = "LTD";
                } else {
                  btnClass = "bg-white text-black border-white";
                  label = "YES";
                }
              }

              return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-14 h-14 flex flex-col items-center justify-center rounded-sm transition-colors border ${btnClass}`}
              >
                <span className="text-sm font-medium">{day.charAt(0).toUpperCase()}</span>
                <span className="text-[9px] uppercase tracking-tighter mt-1">{label}</span>
              </button>
            )})}
          </div>
        </div>
        <div className="text-sm text-neutral-400 max-w-xs">
          Click to toggle days. Drag across the calendar below to select dates and apply overrides.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {months.map((monthDate) => {
          const start = startOfMonth(monthDate);
          const end = endOfMonth(monthDate);
          const days = eachDayOfInterval({ start, end });
          const startPadding = getDay(start); // 0 = Sunday
          
          return (
            <div key={monthDate.toISOString()}>
              <h2 className="text-2xl font-light tracking-widest uppercase mb-6 border-b border-neutral-900 pb-2">
                {format(monthDate, "MMMM yyyy")}
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-xs tracking-widest text-neutral-600 uppercase pb-2">
                    {d}
                  </div>
                ))}
                
                {Array.from({ length: startPadding }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {days.map(day => {
                  const isSel = isDateSelected(day);
                  const dateStr = format(day, "yyyy-MM-dd");
                  
                  // Find if this day is part of a range (search backwards so latest override takes precedence)
                  const activeRange = [...ranges].reverse().find(r => dateStr >= r.start && dateStr <= r.end);
                  
                  let cellClass = "aspect-square flex flex-col items-center justify-center border cursor-crosshair transition-colors select-none relative ";
                  let icon = null;
                  let label = null;
                  
                  if (isSel) {
                    cellClass += "bg-white text-black border-white z-10";
                  } else if (activeRange) {
                    if (activeRange.publicLabel === "Travel") {
                      cellClass += "bg-blue-950/30 border-blue-900/50 text-blue-400";
                      icon = "✈️";
                      label = "Travel";
                    } else if (activeRange.status === "booked") {
                      cellClass += "bg-emerald-950/20 border-emerald-900/40 text-emerald-500";
                      icon = "💼";
                      label = "Booked";
                    } else if (activeRange.status === "limited") {
                      cellClass += "bg-amber-950/20 border-amber-900/40 text-amber-500";
                      icon = "🌗";
                      label = "Limited";
                    } else {
                      cellClass += "bg-neutral-900 border-neutral-800 text-neutral-500";
                      icon = "✕";
                      label = "Unavail";
                    }
                  } else {
                    cellClass += "border-neutral-900 text-neutral-400 hover:border-neutral-700";
                  }

                  const hasBooking = bookings.some(b => b.date === dateStr);

                  return (
                    <div 
                      key={dateStr}
                      onMouseDown={(e) => handleMouseDown(e, day)}
                      onMouseEnter={() => handleMouseEnter(day)}
                      onMouseUp={(e) => handleMouseUp(e, day)}
                      className={cellClass}
                    >
                      <span className="text-sm font-light z-10">{format(day, "d")}</span>
                      {icon && <span className="text-xs mt-1 opacity-70 z-10">{icon}</span>}
                      {hasBooking && !icon && <div className="w-1 h-1 bg-white rounded-full mt-1 z-10" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {menuPos && selectedRange && (
        <>
          {/* Overlay to catch outside clicks */}
          <div 
            className="fixed inset-0 z-40"
            onMouseDown={() => { setSelectedRange(null); setMenuPos(null); }}
          />
          <div 
            className="fixed bg-neutral-950 border border-neutral-700 shadow-2xl p-4 flex flex-col gap-2 z-50 rounded-sm"
          style={{ top: menuPos.y + 10, left: menuPos.x + 10 }}
        >
          <div className="text-xs text-neutral-400 tracking-widest uppercase mb-2">
            {isSameDay(selectedRange.start, selectedRange.end) 
              ? format(selectedRange.start, "MMM d")
              : `${format(selectedRange.start, "MMM d")} - ${format(selectedRange.end, "MMM d")}`
            }
          </div>
          <button onClick={markVacation} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-sm text-left">
            ✈️ Mark as Vacation
          </button>
          <button onClick={markBooked} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-sm text-left">
            💼 Mark as Fully Booked
          </button>
          <button onClick={markLimited} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-sm text-left">
            ⚠️ Mark as Limited
          </button>
          <button onClick={markUnavailable} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-sm text-left">
            🚫 Mark as Unavailable
          </button>
          <button onClick={clearSelection} className="px-4 py-2 bg-red-950/50 text-red-500 hover:bg-red-900/50 text-sm text-left mt-2 border border-red-900/50">
            Clear Dates
          </button>
          <button onClick={() => { setSelectedRange(null); setMenuPos(null); }} className="text-xs text-neutral-500 hover:text-white mt-2">
            Cancel
          </button>
        </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-neutral-950 border-t border-neutral-900 p-6 flex items-center justify-between z-40">
        <div className="text-neutral-400 text-sm">{statusMsg}</div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors"
        >
          Save Calendar
        </button>
      </div>
    </div>
  );
}
