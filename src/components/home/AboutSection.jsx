"use client";
import React from "react";

const features = [
  {
    title: "Verified Caretakers",
    desc: "Every professional on our platform undergoes a rigorous background check and NID verification.",
    icon: "🛡️",
  },
  {
    title: "24/7 Availability",
    desc: "Whether it's an emergency or a planned visit, our caretakers are available around the clock.",
    icon: "⏰",
  },
  {
    title: "Flexible Booking",
    desc: "Book by the hour or by the day. Our dynamic system calculates the cost based on your specific needs.",
    icon: "📅",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side Img */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop" 
                alt="Caregiving Mission"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/*  Bg Ele */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply 
            filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -top-10 -right-10 w-64 h-64
             bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 
             animate-blob animation-delay-2000"></div>
          </div>

          {/* RT Content */}
          <div className="lg:w-1/2">
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
              Making Caregiving <br /> 
              <span className="text-blue-600">Easy & Accessible.</span>
            </h2>
            <p className="mt-6 text-slate-500 text-lg leading-relaxed">
              Care.xyz was born out of a simple need: to provide families in Bangladesh with 
              reliable, professional, and secure care services. We bridge the gap between 
              skilled caretakers and families in need of baby sitting, elderly support, 
              and special care.
            </p>

            {/* Feature List */}
            <div className="mt-10 space-y-8">
              {features.map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex items-center 
                  justify-center text-2xl group-hover:bg-blue-600 
                  group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}