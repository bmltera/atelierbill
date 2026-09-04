"use client";

import { siteConfig } from "@/content/site";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────────────
   Title typography — shared across all 3 layers so they align pixel-
   perfectly. Using Outfit (clean modern grotesk, light 300 weight)
   for more body than the previous Inter extralight.
   ────────────────────────────────────────────────────────────────── */
const titleClasses =
  "text-[clamp(2.25rem,6.5vw,5.5rem)] tracking-[0.10em] sm:tracking-[0.14em] md:tracking-[0.16em] uppercase font-normal leading-none font-[family-name:var(--font-display)]";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>(siteConfig.hero.videoUrl);

  useEffect(() => {
    setMounted(true);

    function resolveOptimalVideoTier() {
      const hero = siteConfig.hero;
      const largeSrc = hero.videoUrl || "/showreel-large.mp4";
      const mediumSrc = hero.videoMediumUrl || "/showreel-medium.mp4";
      const smallSrc = hero.videoSmallUrl || hero.mobileVideoUrl || "/showreel-small.mp4";

      // Check Network Information API
      const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
      const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;

      // 1. Data Saver mode enabled -> prioritize small (480p)
      if (conn?.saveData) {
        setVideoSrc(smallSrc);
        return;
      }

      // 2. Slow connection (2G, slow-2g, or downlink < 1.8 Mbps)
      const isSlow =
        conn?.effectiveType === "slow-2g" ||
        conn?.effectiveType === "2g" ||
        (typeof conn?.downlink === "number" && conn.downlink < 1.8);

      if (isSlow) {
        setVideoSrc(smallSrc);
        return;
      }

      // 3. Moderate connection (3G, downlink < 4.5 Mbps, or narrow mobile device on cellular)
      const isModerate =
        conn?.effectiveType === "3g" ||
        (typeof conn?.downlink === "number" && conn.downlink < 4.5) ||
        (typeof window !== "undefined" && window.innerWidth < 640 && conn?.effectiveType !== "4g");

      if (isModerate) {
        setVideoSrc(mediumSrc);
        return;
      }

      // 4. Fast broadband / high-speed Wi-Fi / 4G -> 1080p Large
      setVideoSrc(largeSrc);
    }

    resolveOptimalVideoTier();

    // Listen for network changes (e.g. user moves from Wi-Fi to cellular)
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
    const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    if (conn?.addEventListener) {
      conn.addEventListener("change", resolveOptimalVideoTier);
      return () => conn.removeEventListener("change", resolveOptimalVideoTier);
    }
  }, []);

  const hasVideo = mounted && Boolean(videoSrc);

  return (
    <section className="relative w-full h-[100dvh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
      {/* ═══════════════════════════════════════════════════════════
          BASE LAYER: Full-screen background video / poster
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 bg-black">
        {hasVideo ? (
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src={videoSrc} type="video/mp4" />
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
          TITLE LAYER 1 — Base text (foundational readability)
          Subtle off-white fill with deep shadow provides a stable
          shadow shelf, allowing the moving video texture in Layer 2
          to have full dynamic contrast without washing out.
          ═══════════════════════════════════════════════════════════ */}
      <div
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
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 2 — Masked video (the dynamic dual-video effect)
          Duplicate video with boosted contrast and silver luminance.
          Motion, dancers, choreography, and light sweeps punch
          through the letterforms with vivid clarity.
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen">
        <div className="absolute inset-0 overflow-hidden bg-black">
          {hasVideo ? (
            <video
              key={`mask-${videoSrc}`}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full grayscale brightness-[1.35] contrast-[1.45]"
            >
              <source src={videoSrc} type="video/mp4" />
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
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 3 — Edge / stroke highlight
          Crisp, fine text-stroke ensures letterform edges stay
          razor-sharp even during dark video frames.
          ═══════════════════════════════════════════════════════════ */}
      <div
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
      </div>

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
          <div
            className="absolute top-full flex flex-row gap-8 sm:gap-11 md:gap-14 lg:gap-16 items-center justify-center pointer-events-auto"
            style={{ marginTop: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
          >
            <Link
              href="/work"
              className="text-[12px] md:text-[11.5px] tracking-[0.09em] sm:tracking-[0.11em] uppercase font-medium text-white/90 border-b border-white/40 pb-1.5 transition-all duration-300 hover:text-white hover:border-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)" }}
            >
              View Portfolio
            </Link>
            <Link
              href="/availability"
              className="text-[12px] md:text-[11.5px] tracking-[0.09em] sm:tracking-[0.11em] uppercase font-medium text-white/90 border-b border-white/40 pb-1.5 transition-all duration-300 hover:text-white hover:border-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)" }}
            >
              Check Availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
