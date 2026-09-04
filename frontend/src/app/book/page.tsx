"use client";

import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/content/site";
import { Suspense } from "react";

function BookingForm() {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");

  return (
    <div className="pt-32 pb-24 max-w-2xl mx-auto px-6 w-full text-center">
      <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-8">
        Booking
      </h1>

      {dateStr && (
        <div className="mb-12 inline-block px-6 py-3 border border-white/20 text-sm tracking-widest uppercase">
          Requested Date: <span className="text-white">{dateStr}</span>
        </div>
      )}

      <p className="text-neutral-400 font-light mb-16 leading-relaxed">
        Please dm us on Instagram to inquire about availability and rates.
      </p>

      <div className="flex justify-center">
        <a
          href={siteConfig.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-5 bg-white text-black text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors uppercase"
        >
          Contact on Instagram
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
