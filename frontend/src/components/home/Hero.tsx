"use client";

import { siteConfig } from "@/content/site";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────
   Title typography — shared across all 3 layers so they align pixel-
   perfectly. Using Outfit (clean modern grotesk, light 300 weight)
   for more body than the previous Inter extralight.
   ────────────────────────────────────────────────────────────────── */
const titleClasses =
  "text-[clamp(2.25rem,6.5vw,5.5rem)] tracking-[0.10em] sm:tracking-[0.14em] md:tracking-[0.16em] uppercase font-normal leading-none font-[family-name:var(--font-display)]";

export function Hero() {
  const hero = siteConfig.hero;
  
  // We check for window to ensure we don't render the video tag immediately on server 
  // if it causes hydration mismatches, but native <source> tags are hydration-safe.
  const hasVideo = Boolean(hero.desktopMp4 || hero.mobileMp4);

  return (
    <section className="relative w-full h-[100dvh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
      {/* ═══════════════════════════════════════════════════════════
          BASE LAYER: Full-screen background video / poster
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 bg-black">
        {hasVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={hero.posterUrl || undefined}
            className="object-cover w-full h-full"
          >
            {/* Mobile-first sources */}
            {hero.mobileWebm && <source src={hero.mobileWebm} type="video/webm" media="(max-width: 767px)" />}
            {hero.mobileMp4 && <source src={hero.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
            {/* Desktop sources */}
            {hero.desktopWebm && <source src={hero.desktopWebm} type="video/webm" media="(min-width: 768px)" />}
            {hero.desktopMp4 && <source src={hero.desktopMp4} type="video/mp4" media="(min-width: 768px)" />}
          </video>
        ) : null}

        {/* Peripheral vignette — darkens edges, keeps center open */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

        {/* Localized radial darkening behind the title area only.
            Subtly soft ellipse — creates readable zone over bright video
            without looking like a visible box or heavy overlay. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 46%, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.22) 55%, transparent 80%)",
          }}
        />

        {/* Top gradient for nav legibility */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 1 — Base text
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center text-center pointer-events-none"
        style={{ marginTop: "-3vh" }}
      >
        <h1
          className={titleClasses}
          style={{
            color: "rgba(242, 240, 238, 0.22)",
            textShadow:
              "0 0 32px rgba(0,0,0,0.85), 0 2px 16px rgba(0,0,0,0.7)",
          }}
        >
          {siteConfig.name}
        </h1>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 2 — Masked video
          ═══════════════════════════════════════════════════════════ */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
      >
        <div className="absolute inset-0 overflow-hidden bg-black">
          {hasVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={hero.posterUrl || undefined}
              className="object-cover w-full h-full grayscale brightness-[1.35] contrast-[1.45]"
            >
              {/* Note: Browser networking stack will automatically deduplicate fetches for the exact same source URLs */}
              {hero.mobileWebm && <source src={hero.mobileWebm} type="video/webm" media="(max-width: 767px)" />}
              {hero.mobileMp4 && <source src={hero.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
              
              {hero.desktopWebm && <source src={hero.desktopWebm} type="video/webm" media="(min-width: 768px)" />}
              {hero.desktopMp4 && <source src={hero.desktopMp4} type="video/mp4" media="(min-width: 768px)" />}
            </video>
          ) : null}
        </div>

        {/* Black mask — only the title letterforms punch through */}
        <div
          className="absolute inset-0 bg-black text-white mix-blend-multiply flex items-center justify-center text-center"
          style={{ marginTop: "-3vh" }}
        >
          <span aria-hidden="true" className={titleClasses}>
            {siteConfig.name}
          </span>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 3 — Edge / stroke highlight
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-30 flex items-center justify-center text-center pointer-events-none"
        style={{ marginTop: "-3vh" }}
      >
        <span
          aria-hidden="true"
          className={titleClasses}
          style={{
            color: "transparent",
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.24)",
          }}
        >
          {siteConfig.name}
        </span>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          CONTENT LAYER — CTAs
          Clean, readable, editorial. font-weight: 500, tighter
          tracking (0.09em–0.11em), increased mobile font size (+9%),
          and optically balanced vertical separation.
          Positioned directly below the title bounding box so the
          title's vertical centering is perfectly preserved.
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-40 flex items-center justify-center text-center pointer-events-none"
        style={{ marginTop: "-3vh" }}
      >
        <div className="relative flex flex-col items-center">
          {/* Invisible anchor matching the title bounding box pixel-for-pixel */}
          <div
            className={`${titleClasses} opacity-0 select-none pointer-events-none`}
            aria-hidden="true"
          >
            {siteConfig.name}
          </div>

          {/* CTAs anchored below the title with generous editorial breathing room */}
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full flex flex-row gap-8 sm:gap-11 md:gap-14 lg:gap-16 items-center justify-center pointer-events-auto"
            style={{ marginTop: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
          >
            <Link
              href="/work"
              className="text-[12px] md:text-[11.5px] tracking-[0.09em] sm:tracking-[0.11em] uppercase font-medium text-white/90 border-b border-white/40 pb-1 transition-all duration-300 hover:text-white hover:border-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)" }}
            >
              View Portfolio
            </Link>
            <Link
              href="/availability"
              className="text-[12px] md:text-[11.5px] tracking-[0.09em] sm:tracking-[0.11em] uppercase font-medium text-white/90 border-b border-white/40 pb-1 transition-all duration-300 hover:text-white hover:border-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)" }}
            >
              Check Availability
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
