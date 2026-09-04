import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto pb-12 pt-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] text-neutral-600 tracking-[0.2em] uppercase">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </div>
        
        <div className="flex gap-8 text-[10px] tracking-[0.2em] uppercase">
          <a 
            href={siteConfig.contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-300 transition-colors duration-300"
          >
            Instagram
          </a>
          <a 
            href={`mailto:${siteConfig.contact.email}`}
            className="text-neutral-600 hover:text-neutral-300 transition-colors duration-300"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
