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
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto h-full pb-16">
        <h1 className="text-3xl md:text-5xl lg:text-7xl tracking-[0.3em] uppercase font-light text-white/90 mb-8">
          {siteConfig.name}
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-xl mb-16 font-light tracking-wide leading-relaxed">
          {siteConfig.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-10 w-full sm:w-auto items-center justify-center">
          <Link 
            href="/work"
            className="text-xs tracking-[0.2em] font-light text-white uppercase transition-colors duration-300 border-b border-white/30 hover:border-white/70 pb-2"
          >
            View Work
          </Link>
          <Link 
            href="/availability"
            className="text-xs tracking-[0.2em] font-light text-neutral-400 uppercase transition-colors duration-300 border-b border-transparent hover:text-white hover:border-white/30 pb-2"
          >
            Check Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
