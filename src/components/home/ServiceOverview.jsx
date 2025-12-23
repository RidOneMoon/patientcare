"use client";
import Link from "next/link";

const services = [
  {
    id: "baby-care",
    title: "Baby Sitting",
    description: "Professional care for your little ones, ensuring safety and early development in a loving environment.",
    icon: "👶",
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: "elderly-care",
    title: "Elderly Service",
    description: "Compassionate support for seniors, focusing on health monitoring, companionship, and daily assistance.",
    icon: "👴",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "sick-care",
    title: "Sick People Service",
    description: "Specialized home care for recovering patients, including medication reminders and basic medical aid.",
    icon: "🤒",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function ServiceOverview() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black uppercase tracking-widest text-sm">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">Our Specialized Care</h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
            Choose the right care for your family. All our services are provided by certified and background-checked professionals.
          </p>
        </div>
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {service.description}
              </p>

             <Link 
  href={`/services/${service.id}`}
  className="group inline-flex items-center gap-3 font-black text-blue-600 transition-all duration-300"
>
  <button className="relative px-8 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-2xl shadow-[0_10px_20px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-3 overflow-hidden">
    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
    
    <span className="relative tracking-tight text-sm">Take This Service</span>
    
    <div className="relative flex items-center group-hover:translate-x-1 transition-transform duration-300">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={3} 
          d="M17 8l4 4m0 0l-4 4m4-4H3" 
        />
      </svg>
    </div>
  </button>
</Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block p-1 bg-white rounded-2xl border border-slate-100">
             <Link href="/register" className="block px-8 py-4 bg-slate-900
              text-white rounded-xl font-bold hover:bg-slate-800 transition">
                Start Booking Today
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}