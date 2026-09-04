"use client";

import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/content/site";
import { Suspense } from "react";

function BookingForm() {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");

  return (
    <div className="pt-32 pb-32 max-w-[1200px] mx-auto px-8 md:px-12 w-full flex flex-col items-center justify-center min-h-[75vh]">
      <div className="w-full flex flex-col items-center py-24 relative">
        <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.25em] uppercase mb-10 text-center text-white/90">
          Booking
        </h1>

        {dateStr && (
          <div className="mb-10 text-[11px] tracking-[0.15em] uppercase text-white/35 flex items-center gap-3">
            <span className="h-px w-6 bg-white/10" />
            <span>Requested Date: <span className="text-white/60 ml-1.5">{dateStr}</span></span>
            <span className="h-px w-6 bg-white/10" />
          </div>
        )}

        <p className="text-white/40 font-light mb-14 text-center max-w-sm leading-relaxed text-sm tracking-wide">
          Please DM us on Instagram to inquire about availability and rates.
        </p>

        <a
          href={siteConfig.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-3 font-light transition-colors duration-200 group-hover:text-white/50">
            Contact on
          </span>
          <span className="text-2xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-white/85 group-hover:text-white transition-colors duration-200">
            Instagram
          </span>
          <span className="text-xs md:text-sm tracking-[0.18em] text-white/45 group-hover:text-white/80 transition-colors duration-200 mt-2 font-light">
            @atelierbill
          </span>
          <div className="h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-20 group-hover:bg-white/60 mt-4" />
        </a>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white/30">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
