"use client";

import { Project } from "@/content/work";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PortfolioGalleryProps {
  projects: Project[];
}

export function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTouchOrMobile, setIsTouchOrMobile] = useState(false);

  // Detect touch or mobile viewport
  useEffect(() => {
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth < 768;
      setIsTouchOrMobile(hasTouch || isNarrow);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Close modal with Escape key and manage body scroll lock
  const closeModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, closeModal]);

  const handleCardClick = (project: Project, e: React.MouseEvent) => {
    // On touch/mobile: let native anchor click open YouTube directly (app / external tab)
    if (isTouchOrMobile) {
      return;
    }

    // On desktop: intercept and open the clean modal player
    e.preventDefault();
    setSelectedProject(project);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-x-16 md:gap-y-24">
        {projects.map((project, idx) => {
          const youtubeUrl = `https://www.youtube.com/watch?v=${project.youtubeId}`;

          return (
            <a
              key={project.id}
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleCardClick(project, e)}
              className="group block cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label={`Play ${project.title}`}
            >
              {/* Card Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 border border-white/[0.04]">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-premium md:group-hover:scale-[1.015] opacity-85 md:group-hover:opacity-100"
                  priority={idx < 2}
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

                {/* Subtle Minimal Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-premium">
                  <div className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 shadow-2xl">
                    <Play size={18} className="ml-0.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Minimal Card Header */}
              <div className="mt-5 flex flex-col gap-1 transition-transform duration-300 ease-premium md:group-hover:translate-x-1">
                <h2 className="text-sm md:text-base font-light tracking-[0.14em] uppercase text-white/90 md:group-hover:text-white transition-colors duration-300">
                  {project.title}
                </h2>
                <div className="text-[11px] text-secondary tracking-[0.2em] uppercase font-light flex items-center gap-2">
                  <span>{project.clientOrArtist}</span>
                  <span className="text-tertiary">•</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Desktop Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-5xl bg-neutral-950 border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs tracking-[0.2em] uppercase text-secondary font-light">
                    {selectedProject.clientOrArtist}
                  </span>
                  <span className="text-tertiary">•</span>
                  <span className="text-xs tracking-[0.2em] uppercase text-secondary font-light">
                    {selectedProject.year}
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="p-1.5 -mr-1.5 text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedProject.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={selectedProject.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Bottom Header */}
              <div className="px-6 py-4 flex flex-col gap-1 bg-black/60 border-t border-white/[0.06]">
                <h3 className="text-base md:text-lg font-light tracking-[0.12em] uppercase text-white">
                  {selectedProject.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
