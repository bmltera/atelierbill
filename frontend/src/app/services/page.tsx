import { services } from "@/content/services";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-32 max-w-[1200px] mx-auto px-8 md:px-12 w-full">
      <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-extralight tracking-[0.25em] uppercase mb-32 text-center text-white/90 opacity-0 animate-fade-in-up">
        Services
      </h1>
      
      <div className="flex flex-col border-b border-white/[0.06]">
        {services.map((service) => (
          <div key={service.id} className="border-t border-white/[0.06] py-14 md:py-20">
            <h2 className="text-[clamp(1.25rem,3vw,2.5rem)] font-extralight tracking-[0.12em] uppercase mb-6 text-white/80">
              {service.title}
            </h2>
            <p className="text-white/35 font-light leading-relaxed text-base md:text-lg max-w-2xl">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
