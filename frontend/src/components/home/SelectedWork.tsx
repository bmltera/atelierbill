import { projects } from "@/content/work";
import Link from "next/link";
import Image from "next/image";

export function SelectedWork() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-16">Selected Work</h2>
        
        <div className="flex flex-col gap-24 md:gap-0">
          {featured.map((project, idx) => {
            // Subtle alternating staggered layout for desktop pacing
            const isEven = idx % 2 === 0;
            const staggerClass = idx === 0 
              ? "md:w-[90%] md:mx-auto" 
              : (isEven ? "md:w-[85%] md:ml-auto md:mr-0 md:-mt-12" : "md:w-[85%] md:mr-auto md:ml-0 md:-mt-24");

            return (
              <Link 
                key={project.id} 
                href="/work" 
                className={`group block ${staggerClass} relative z-10 hover:z-20`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 mb-6">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-[1.02] opacity-80 group-hover:opacity-100"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 transition-transform duration-[800ms] ease-out group-hover:translate-x-1">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-light tracking-wide uppercase mb-2 text-neutral-200 group-hover:text-white transition-colors duration-500">
                      {project.title}
                    </h3>
                    <div className="text-xs text-neutral-500 tracking-[0.2em] uppercase">
                      {project.clientOrArtist} <span className="opacity-50 mx-1">/</span> {project.year}
                    </div>
                  </div>
                  
                  {project.credits?.[0] && (
                    <div className="text-xs text-neutral-500 tracking-[0.2em] uppercase hidden md:block text-right">
                      {project.credits[0]}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <Link 
            href="/work"
            className="inline-block text-sm tracking-[0.2em] uppercase border-b border-neutral-700 pb-2 hover:border-white transition-colors"
          >
            View All Work →
          </Link>
        </div>
      </div>
    </section>
  );
}
