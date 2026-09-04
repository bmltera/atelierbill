import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-neutral-500 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </div>
        
        <div className="flex gap-6 text-sm tracking-widest">
          <a 
            href={siteConfig.contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            INSTAGRAM
          </a>
          <a 
            href={`mailto:${siteConfig.contact.email}`}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            EMAIL
          </a>
        </div>
      </div>
    </footer>
  );
}
