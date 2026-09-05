"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site";

function formatDisplayDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const parts = dateStr.trim().split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return format(d, "EEEE, MMMM d").toUpperCase();
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");
  const formattedDate = formatDisplayDate(dateStr);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100dvh-10rem)] px-6 py-16 md:py-24 text-center">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-[clamp(1.5rem,4vw,2.75rem)] font-light tracking-[0.22em] uppercase text-white/90">
          Booking
        </h1>

        {/* Selected Date: prominent but restrained, naturally formatted */}
        {formattedDate && (
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 sm:mt-5 text-[clamp(0.95rem,2.2vw,1.15rem)] font-normal tracking-[0.18em] uppercase text-white/65"
          >
            {formattedDate}
          </motion.p>
        )}

        {/* Primary Interaction: Contact on Instagram */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: formattedDate ? 0.3 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={formattedDate ? "mt-12 sm:mt-16 md:mt-20" : "mt-10 sm:mt-14 md:mt-16"}
        >
          <a
            href={siteConfig.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-6 sm:p-8 -m-6 sm:-m-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-sm"
          >
            <span className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase font-light text-white/40 transition-colors duration-300 ease-premium group-hover:text-white/65">
              Contact on
            </span>
            
            <span className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.18em] uppercase text-white/90 transition-colors duration-300 ease-premium group-hover:text-white">
              Instagram
            </span>
            
            <span className="mt-2 sm:mt-2.5 text-xs sm:text-sm tracking-[0.16em] text-white/45 transition-colors duration-300 ease-premium group-hover:text-white/80 font-light">
              @atelierbill
            </span>

            {/* Subtle underline reveal */}
            <div className="mt-5 sm:mt-6 h-px w-8 bg-white/25 transition-all duration-300 ease-premium group-hover:w-24 group-hover:bg-white/70" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-white/30 text-xs tracking-widest uppercase">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
