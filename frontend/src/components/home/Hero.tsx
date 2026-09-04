"use client";

import { siteConfig } from "@/content/site";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        {mounted && siteConfig.hero.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={siteConfig.hero.posterUrl}
            className="object-cover w-full h-full opacity-70"
          >
            <source src={siteConfig.hero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-1000"
            style={{ backgroundImage: `url(${siteConfig.hero.posterUrl})` }}
          />
        )}
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl md:text-6xl lg:text-8xl tracking-widest uppercase font-medium mb-6">
          {siteConfig.name}
        </h1>
        <p className="text-neutral-300 text-lg md:text-2xl max-w-2xl mb-12 font-light">
          {siteConfig.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            href="/work"
            className="px-8 py-4 bg-white text-black text-sm tracking-widest font-medium hover:bg-neutral-200 transition-colors uppercase text-center"
          >
            View Work
          </Link>
          <Link 
            href="/availability"
            className="px-8 py-4 bg-transparent border border-white text-white text-sm tracking-widest font-medium hover:bg-white/10 transition-colors uppercase text-center"
          >
            Check Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
