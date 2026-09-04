import { team } from "@/content/team";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-5xl font-light tracking-[0.3em] uppercase mb-32 text-center text-white/90">
        About
      </h1>

      <div className="border-t border-neutral-900 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-8">
          {team.map((member) => (
            <div key={member.id} className="pt-8">
              <a 
                href={`https://instagram.com/${member.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-block"
              >
                <h3 className="text-6xl md:text-8xl font-light tracking-tight uppercase mb-6 text-neutral-200 group-hover:text-white transition-colors duration-500">
                  {member.name}
                </h3>
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-neutral-500 tracking-[0.2em] uppercase">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-2 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="text-xs font-mono tracking-normal normal-case">
                      @{member.instagram}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
