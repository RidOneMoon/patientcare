

"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; 
import toast, { Toaster } from "react-hot-toast";

const LOCATION_DATA = {
  Dhaka: ["Dhaka City", "Gazipur", "Narayanganj", "Savar"],
  Rangpur: ["Rangpur City", "Dinajpur", "Kurigram", "Gaibandha"],
  Rajshahi: ["Rajshahi City", "Bogra", "Pabna", "Naogaon"],
  Sylhet: ["Sylhet City", "Moulvibazar", "Habiganj", "Sunamganj"],
};

export default function BookingPage({ params }) {
  const { service_id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: { shift: "day", duration: 1 }
  });

  const selectedShift = watch("shift");
  const selectedDivision = watch("division");
  const selectedDuration = watch("duration") || 1;
  const hoursPerShift = selectedShift === "day" ? 8 : 12;

  useEffect(() => {
    if (!authLoading && user) {
      setValue("customerName", user.displayName || user.name || "");
      setValue("customerEmail", user.email || "");
      setValue("phone", user.contact || user.phone || "");
      setValue("nid", user.nid || "");
      setIsReady(true);
    }
  }, [user, authLoading, setValue]);

  useEffect(() => {
    fetch(`/api/services/${service_id}`)
      .then((res) => res.json())
      .then((data) => setService(data));
  }, [service_id]);

  const nextStep = async () => {
    const isValid = await trigger(["customerName", "phone", "nid"]);
    
    if (!isValid) {
      Swal.fire({
        title: "Missing Information",
        text: "Please provide your Name, Phone, and NID to continue with the booking.",
        icon: "warning",
        confirmButtonColor: "#0f172a",
        confirmButtonText: "Okay",
        customClass: {
          popup: 'rounded-[2rem]',
        }
      });
      return;
    }
    setStep(2);
  };

  if (authLoading || !service || !isReady) return null;

  const totalCost = service.price * hoursPerShift * selectedDuration;

  // --- ADDED THE ONFINALSUBMIT LOGIC HERE ---
  const onFinalSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Save to Database
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, serviceId: service_id, totalCost }),
      });

      if (res.ok) {
        // 2. Trigger Email
        console.log("Booking saved, sending email...");
        try {
          const emailRes = await fetch("/api/emails/invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.customerEmail,
              name: data.customerName,
              serviceTitle: service.title,
              totalCost: totalCost,
              date: data.date,
              shift: data.shift
            }),
          });

          const emailData = await emailRes.json();

          if (!emailRes.ok) {
            console.error("Email failed:", emailData.error);
            toast.error("Booking saved, but invoice email failed to send (Trial restriction).");
          }
        } catch (emailErr) {
          console.error("Email fetch error:", emailErr);
        }

        // 3. Success Message
        Swal.fire({ 
          title: "Success!", 
          text: "Booking complete. Check your email!", 
          icon: "success",
          confirmButtonColor: "#0f172a",
        });
        router.push("/my-bookings");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <Toaster position="top-center" />
      
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-slate-900 px-8 pt-10 pb-6 text-white">
          <h2 className="text-xl font-black mb-4 pr-10">{service.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-black uppercase text-blue-400">Step {step}/3</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFinalSubmit)} className="p-8">
          
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-bold text-slate-800">1. Verify Profile</h3>
              <div className="space-y-3">
                <div className="group">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <input {...register("customerName", { required: true })} className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                  <input {...register("phone", { required: true })} className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">NID Number</label>
                  <input {...register("nid", { required: true })} className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 ring-blue-500 transition-all" />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transform transition active:scale-95">
                Continue to Schedule
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-bold text-slate-800">2. Care Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" {...register("date", { required: true })} className="p-4 bg-slate-50 rounded-xl outline-none ring-blue-500 focus:ring-2" />
                <input type="number" min="1" {...register("duration", { required: true })} className="p-4 bg-slate-50 rounded-xl outline-none ring-blue-500 focus:ring-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${selectedShift === 'day' ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                  <input type="radio" {...register("shift")} value="day" className="hidden" />
                  <span className="font-bold block text-sm">Day (8h)</span>
                </label>
                <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${selectedShift === 'night' ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                  <input type="radio" {...register("shift")} value="night" className="hidden" />
                  <span className="font-bold block text-sm">Night (12h)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-black">Next: Location</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in slide-in-from-right-5 duration-300">
              <h3 className="text-lg font-bold text-slate-800">3. Finalize Location</h3>
              <div className="grid grid-cols-2 gap-3">
                <select {...register("division", { required: true })} className="p-4 bg-slate-50 rounded-xl outline-none">
                  <option value="">Division</option>
                  {Object.keys(LOCATION_DATA).map(div => <option key={div} value={div}>{div}</option>)}
                </select>
                <select {...register("district", { required: true })} disabled={!selectedDivision} className="p-4 bg-slate-50 rounded-xl outline-none disabled:opacity-50">
                  <option value="">District</option>
                  {selectedDivision && LOCATION_DATA[selectedDivision].map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>
              <textarea {...register("address", { required: true })} placeholder="Full Address" className="w-full p-4 bg-slate-50 rounded-xl h-24 outline-none ring-blue-500 focus:ring-2" />
              
              <div className="bg-blue-600 p-6 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-blue-200">
                <span className="text-xs font-black uppercase tracking-wider">Total Due</span>
                <span className="text-3xl font-black">৳{totalCost}</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Back</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 disabled:bg-slate-300">
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}