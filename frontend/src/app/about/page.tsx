import { team } from "@/content/team";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-8 text-center">
        About
      </h1>

      
      <div className="border-t border-neutral-900 pt-24">
        <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-16 text-center">Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {team.map((member) => (
            <div key={member.id} className="text-center md:text-left">
              <a 
                href={`https://instagram.com/${member.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-block mb-4"
              >
                <h3 className="text-3xl font-light tracking-widest uppercase mb-1 group-hover:text-neutral-300 transition-colors">
                  {member.name}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-600 group-hover:text-neutral-400 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="text-xs font-mono tracking-normal normal-case">
                    @{member.instagram}
                  </span>
                </div>
              </a>
              <p className="text-neutral-400 tracking-widest uppercase text-sm">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
