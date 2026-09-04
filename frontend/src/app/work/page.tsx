import { projects } from "@/content/work";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";

export const metadata = {
  title: "Portfolio",
  description: "Curated film, dance, and performance videography by Atelier Bill.",
};

export default function WorkPage() {
  return (
    <div className="pt-32 pb-32 max-w-[1300px] mx-auto px-6 md:px-12 w-full">
      {/* Editorial Header */}
      <div className="mb-20 md:mb-28 text-center flex flex-col items-center">
        <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.25em] uppercase text-white/90">
          Portfolio
        </h1>
      </div>

      {/* Curated Gallery Grid */}
      <PortfolioGallery projects={projects} />
    </div>
  );
}
