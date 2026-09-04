import { services } from "@/content/services";
import Link from "next/link";

export function Services() {
  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 md:gap-32">
          
          <div className="md:w-1/3">
            <h2 className="text-xs text-neutral-500 tracking-[0.3em] uppercase mb-8">What We Do</h2>
          </div>
          
          <div className="md:w-2/3 flex flex-col gap-12">
            {services.map((service, idx) => (
              <div key={service.id} className="border-t border-neutral-800 pt-8 first:border-0 first:pt-0 group">
                <div className="flex gap-6">
                  <span className="text-xs font-mono text-neutral-600 mt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl tracking-widest uppercase mb-4 font-light text-neutral-200 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-neutral-400 font-light leading-relaxed max-w-xl">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-neutral-800">
              <Link 
                href="/services"
                className="inline-block text-sm tracking-[0.2em] uppercase border-b border-neutral-700 pb-2 hover:border-white transition-colors"
              >
                View Details →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
