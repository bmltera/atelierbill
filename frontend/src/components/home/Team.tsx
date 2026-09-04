import { team } from "@/content/team";
import Link from "next/link";

export function Team() {
  return (
    <section className="py-32 bg-black border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-start mb-24">
          <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase">Team</h2>
          <Link 
            href="/about"
            className="hidden md:inline-block text-xs tracking-[0.2em] uppercase border-b border-neutral-800 pb-1 hover:border-white transition-colors duration-300 text-neutral-400 hover:text-white"
          >
            More About Us
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          {team.map((member) => (
            <div key={member.id} className="border-t border-neutral-900 pt-8">
              <a 
                href={`https://instagram.com/${member.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-block"
              >
                <h3 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight uppercase mb-4 text-neutral-200 group-hover:text-white transition-colors duration-500">
                  {member.name}
                </h3>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-neutral-500 tracking-[0.2em] uppercase">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-2 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
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

        <div className="mt-16 md:hidden border-t border-neutral-900 pt-12">
          <Link 
            href="/about"
            className="inline-block text-xs tracking-[0.2em] uppercase border-b border-neutral-800 pb-1 text-neutral-400 hover:text-white hover:border-white transition-colors duration-300"
          >
            More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
