"use client";

import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/content/site";
import { Suspense } from "react";

function BookingForm() {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");

  return (
    <div className="pt-40 pb-32 max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full flex flex-col items-center border-y border-neutral-900 py-24 relative">
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.3em] uppercase mb-12 text-center text-white/90">
          Booking
        </h1>

        {dateStr && (
          <div className="mb-12 text-xs tracking-[0.2em] uppercase text-neutral-500 flex items-center gap-4">
            <span className="h-px w-8 bg-neutral-800" />
            <span>Requested Date: <span className="text-neutral-200 ml-2">{dateStr}</span></span>
            <span className="h-px w-8 bg-neutral-800" />
          </div>
        )}

        <p className="text-neutral-400 font-light mb-24 text-center max-w-md leading-relaxed tracking-wide">
          Please dm us on Instagram to inquire about availability and rates.
        </p>

        <a
          href={siteConfig.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4 transition-colors duration-300 group-hover:text-neutral-300">
            Contact on
          </span>
          <span className="text-2xl md:text-4xl font-light tracking-widest uppercase border-b border-transparent group-hover:border-white transition-colors duration-500 pb-2 text-neutral-200 group-hover:text-white">
            Instagram
          </span>
        </a>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-neutral-500">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
