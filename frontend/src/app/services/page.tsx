import { services } from "@/content/services";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full">
      <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-24 text-center">
        Services
      </h1>
      
      <div className="flex flex-col gap-16">
        {services.map((service, idx) => (
          <div key={service.id} className="border-t border-neutral-900 pt-16 first:border-0 first:pt-0">
            <h2 className="text-2xl font-light tracking-widest uppercase mb-6">
              {service.title}
            </h2>
            <p className="text-neutral-300 font-light leading-relaxed text-lg">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
