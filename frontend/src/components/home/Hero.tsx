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
  "text-[clamp(2.5rem,7vw,6rem)] tracking-[0.25em] uppercase font-light leading-none font-[family-name:var(--font-display)]";

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
            Tighter ellipse, subtle opacity — creates readable zone
            without looking like a visible panel or overlay. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 46%, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.18) 50%, transparent 80%)",
          }}
        />

        {/* Top gradient for nav legibility */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 1 — Base text (foundational readability)
          Off-white / silver fill at reduced opacity. This ensures
          the title is always legible even on busy footage.
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center text-center pointer-events-none"
        style={{ marginTop: "-3vh" }}
      >
        <h1
          className={titleClasses}
          style={{
            color: "rgba(230, 228, 225, 0.55)",
            textShadow:
              "0 0 40px rgba(0,0,0,0.5), 0 2px 20px rgba(0,0,0,0.3)",
          }}
        >
          {siteConfig.name}
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TITLE LAYER 2 — Masked video (the premium effect)
          Duplicate video, desaturated + brightened + softened so it
          reads as a refined moving silver/luminous texture inside
          the letterforms — not a busy literal second video.
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
              className="object-cover w-full h-full grayscale brightness-[2.0] contrast-[0.65] blur-[0.5px] opacity-90"
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
          Very subtle text-stroke gives the letters just enough
          definition to separate from the footage without being
          heavy-handed. Uses a faint bright outline.
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
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.12)",
          }}
        >
          {siteConfig.name}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CONTENT LAYER — CTAs
          Clean, readable, understated. No masked-video effect.
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="relative z-40 flex flex-col items-center justify-center text-center pointer-events-auto"
        style={{ marginTop: "-3vh" }}
      >
        {/* Invisible spacer matching the title to position CTAs below it */}
        <div
          className={`${titleClasses} opacity-0 select-none pointer-events-none`}
          aria-hidden="true"
        >
          {siteConfig.name}
        </div>

        <div className="mt-12 flex gap-12 items-center">
          <Link
            href="/work"
            className="text-[11px] tracking-[0.2em] uppercase font-light text-white/85 border-b border-white/35 pb-1.5 transition-all duration-300 hover:text-white hover:border-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            View Portfolio
          </Link>
          <Link
            href="/availability"
            className="text-[11px] tracking-[0.2em] uppercase font-light text-white/85 border-b border-white/35 pb-1.5 transition-all duration-300 hover:text-white hover:border-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            Check Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
