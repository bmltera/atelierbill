import { projects } from "@/content/work";
import Link from "next/link";
import Image from "next/image";

export function SelectedWork() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-16">Selected Work</h2>
        
        <div className="flex flex-col gap-24">
          {featured.map((project, idx) => (
            <Link 
              key={project.id} 
              href="/work" 
              className="group block"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 mb-6">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl md:text-4xl font-light tracking-wide uppercase mb-2 group-hover:text-neutral-300 transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-sm text-neutral-400 tracking-widest uppercase">
                    {project.clientOrArtist} · {project.year}
                  </div>
                </div>
                
                <div className="text-sm text-neutral-500 tracking-widest uppercase hidden md:block text-right">
                  {project.credits[0]}
                </div>
              </div>
            </Link>
          ))}
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
