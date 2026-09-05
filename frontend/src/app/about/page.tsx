import { team } from "@/content/team";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-32 max-w-[1200px] mx-auto px-8 md:px-12 w-full">
      <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.25em] uppercase mb-32 text-center text-white/90 opacity-0 animate-fade-in-up">
        About
      </h1>

      <div className="border-t border-white/[0.06] pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-12">
          {team.map((member) => (
            <div key={member.id}>
              <a 
                href={`https://instagram.com/${member.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <h3 className="text-[clamp(2.5rem,6vw,5rem)] font-extralight tracking-tight uppercase mb-5 text-white/80 group-hover:text-white/95 transition-colors duration-300 ease-premium">
                  {member.name}
                </h3>
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] text-white/40 tracking-[0.2em] uppercase">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-2 text-white/30 group-hover:text-white/50 transition-colors duration-300 ease-premium">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="text-[11px] tracking-normal">
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
