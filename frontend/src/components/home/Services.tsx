import { services } from "@/content/services";
import Link from "next/link";

export function Services() {
  return (
    <section className="py-32 bg-black border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24">
          <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase">Services</h2>
          <Link 
            href="/services"
            className="hidden md:inline-block text-xs tracking-[0.2em] uppercase border-b border-neutral-800 pb-1 hover:border-white transition-colors duration-300 text-neutral-400 hover:text-white"
          >
            View Details
          </Link>
        </div>

        <div className="flex flex-col">
          {services.map((service, idx) => (
            <div key={service.id} className="border-t border-neutral-900 py-12 md:py-20 group">
              <div className="flex flex-col md:flex-row gap-6 md:gap-24 items-start">
                <div className="flex-1 mt-2 md:mt-4">
                  <h3 className="text-3xl md:text-5xl tracking-[0.1em] uppercase mb-6 font-light text-neutral-300 group-hover:text-white transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 font-light leading-relaxed max-w-2xl text-base md:text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t border-neutral-900 md:hidden pt-12">
            <Link 
              href="/services"
              className="inline-block text-xs tracking-[0.2em] uppercase border-b border-neutral-800 pb-1 text-neutral-400 hover:text-white hover:border-white transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
