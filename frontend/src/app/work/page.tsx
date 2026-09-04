import { projects } from "@/content/work";
import Image from "next/image";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-24 text-center">
        Selected Work
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {projects.map((project, idx) => (
          <div key={project.id} className="flex flex-col gap-6">
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 group">
              <iframe 
                src={`https://www.youtube.com/embed/${project.youtubeId}`} 
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-light tracking-wide uppercase mb-1">
                {project.title}
              </h2>
              <div className="text-sm text-neutral-400 tracking-widest uppercase mb-2">
                {project.clientOrArtist} · {project.year}
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 tracking-widest uppercase">
                {project.credits.map((credit, i) => (
                  <span key={i}>{credit}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
