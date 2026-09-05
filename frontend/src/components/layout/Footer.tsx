import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto pb-10 pt-20">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] text-white/20 tracking-[0.15em] uppercase">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </div>
        
        <div className="flex gap-8 text-[10px] tracking-[0.15em] uppercase">
          <a 
            href={siteConfig.contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/20 hover:text-white/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
