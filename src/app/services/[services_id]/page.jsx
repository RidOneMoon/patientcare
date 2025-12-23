"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react"; 

export default function ServiceDetails({ params }) {
  const resolvedParams = use(params);
  const services_id = resolvedParams.services_id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${services_id}`)
    .then((res) => {
      if(!res.ok) {
        throw new Error("Service fetch failed with status " + res.status);
      }
      return res.json();
    })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Service Fetch Error:", err);
        setLoading(false);
      });
  }, [services_id]);


  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Loading Service...</div>;
  if (!service || service.length === 0) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="h-80 md:h-125 bg-blue-100 rounded-[3rem] flex items-center justify-center text-blue-300 text-9xl font-black">
          <img src={service?.image} alt="" className=" w-full h-full object-cover rounded-[3rem] "/>
        </div>
        
        <div>
          <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Service Details</span>
          <h1 className="text-5xl font-black text-slate-900 mt-4 leading-tight">{service.title}</h1>
          <p className="text-slate-500 mt-6 text-lg leading-relaxed">{service.description}</p>
          
          <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase">Service Charge</p>
              <p className="text-3xl font-black text-blue-600">৳ {service.price}</p>
            </div>
            
            <Link 
              href={`/booking/${services_id}`}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all"
            >
              Book Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}