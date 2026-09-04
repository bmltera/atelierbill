import { services } from "@/content/services";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-5xl font-light tracking-[0.3em] uppercase mb-32 text-center text-white/90">
        Services
      </h1>
      
      <div className="flex flex-col">
        {services.map((service, idx) => (
          <div key={service.id} className="border-t border-neutral-900 py-16 md:py-24 group">
            <div className="flex flex-col md:flex-row gap-6 md:gap-32 items-start">
              <div className="flex-1 mt-2 md:mt-6">
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase mb-8 text-neutral-200">
                  {service.title}
                </h2>
                <p className="text-neutral-400 font-light leading-relaxed text-lg md:text-xl max-w-2xl">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
