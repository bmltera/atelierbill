import { team } from "@/content/team";
import Link from "next/link";

export function Team() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-16">Who We Are</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 border-t border-neutral-900 pt-16">
          {team.map((member) => (
            <div key={member.id}>
              <a 
                href={`https://instagram.com/${member.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-block mb-3"
              >
                <h3 className="text-xl md:text-2xl font-light tracking-wider uppercase mb-1 group-hover:text-neutral-300 transition-colors">
                  {member.name}
                </h3>
                <div className="flex items-center gap-1.5 text-neutral-600 group-hover:text-neutral-400 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="text-xs font-mono tracking-normal normal-case">
                    @{member.instagram}
                  </span>
                </div>
              </a>
              <p className="text-sm text-neutral-500 tracking-widest uppercase">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link 
            href="/about"
            className="inline-block text-sm tracking-[0.2em] uppercase border-b border-neutral-700 pb-2 hover:border-white transition-colors"
          >
            More About Us →
          </Link>
        </div>
      </div>
    </section>
  );
}
