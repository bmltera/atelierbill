"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/work", label: "PORTFOLIO" },
  { href: "/availability", label: "AVAILABILITY" },
  { href: "/services", label: "SERVICES" },
  { href: "/about", label: "ABOUT" },
  { href: "/book", label: "BOOK" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const showBg = scrolled || !isHome || isOpen;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${showBg ? "bg-black/90 backdrop-blur-md border-white/[0.06]" : "bg-transparent border-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className={`text-[13px] tracking-[0.2em] font-normal z-50 relative uppercase text-white/95 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${!showBg ? 'drop-shadow-sm' : ''}`}
          >
            Atelier Bill
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.18em] font-light">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative py-1 transition-colors duration-300 ease-premium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                    isActive 
                      ? "text-white/95" 
                      : "text-white/50 hover:text-white/75"
                  } ${!showBg ? 'drop-shadow-sm' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="navbar-underline"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/25" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden z-50 relative p-2 -mr-2 text-white/80 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-black flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col items-center gap-8 text-sm tracking-[0.25em] font-light">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`relative py-1 transition-colors duration-300 ease-premium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                      isActive ? "text-white/95" : "text-white/50 hover:text-white/75"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="mobile-navbar-underline"
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-white/25" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
