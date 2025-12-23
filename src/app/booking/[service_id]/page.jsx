"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      shift: "day",
      duration: 1,
    }
  });

  const selectedShift = watch("shift");
  const selectedDivision = watch("division");
  const selectedDuration = watch("duration") || 1;
  const hoursPerShift = selectedShift === "day" ? 8 : 12;

  useEffect(() => {
    if (!authLoading && user) {
      const userPhone = user.contact || user.phone || "";
      const userNid = user.nid || "";

      setValue("customerName", user.displayName || "");
      setValue("customerEmail", user.email || "");
      setValue("phone", userPhone);
      setValue("nid", userNid);

      if (userPhone && userNid) {
        setStep(2);
      }
      setIsReady(true);
    }
  }, [user, authLoading, setValue]);

  useEffect(() => {
    fetch(`/api/services/${service_id}`)
      .then((res) => res.json())
      .then((data) => setService(data));
  }, [service_id]);

  if (authLoading || !service || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-slate-500">Initializing Secure Booking...</p>
        </div>
      </div>
    );
  }

  const totalCost = service.price * hoursPerShift * selectedDuration;

  const onFinalSubmit = async (data) => {
    setLoading(true);
    
    const bookingPayload = {
      serviceId: service_id,
      serviceTitle: service.title,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      phone: data.phone,
      nid: data.nid,
      address: data.address,
      division: data.division,
      district: data.district,
      shift: data.shift,
      duration: data.duration,
      date: data.date,
      totalCost,
      status: "Pending",
      bookedAt: new Date(),
    };

    try {
   
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (res.ok) {
   
        await fetch("/api/emails/invoice", {
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

        Swal.fire({
          title: "Success!",
          text: "Booking successful! Check your email for the invoice.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        }).then(() => router.push("/my-bookings"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({ title: "Error!", text: "Booking failed", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-black">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
        
        {/* HEADER */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black truncate max-w-[70%]">{service.title}</h2>
            <span className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Step {step} of 3
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFinalSubmit)} className="p-8 md:p-12">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">1</div>
                <h3 className="text-xl font-black text-slate-800">Complete Profile</h3>
              </div>
              <div className="space-y-4">
                <input {...register("customerName", { required: true })} placeholder="Name" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none focus:ring-2 ring-blue-500" />
                <input {...register("phone", { required: true })} placeholder="Contact Number" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none focus:ring-2 ring-blue-500" />
                <input {...register("nid", { required: true })} placeholder="NID Number" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none focus:ring-2 ring-blue-500" />
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-colors">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">2</div>
                <h3 className="text-xl font-black text-slate-800">Care Schedule</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                  <input type="date" {...register("date", { required: true })} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Days</label>
                  <input type="number" min="1" {...register("duration", { required: true })} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${selectedShift === 'day' ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                  <input type="radio" {...register("shift")} value="day" className="hidden" />
                  <p className="font-black text-slate-900 text-center">Day Shift</p>
                </label>
                <label className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${selectedShift === 'night' ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                  <input type="radio" {...register("shift")} value="night" className="hidden" />
                  <p className="font-black text-slate-900 text-center">Night Shift</p>
                </label>
              </div>
              <button type="button" onClick={() => setStep(3)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-colors">Next: Location</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">3</div>
                <h3 className="text-xl font-black text-slate-800">Location</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select {...register("division", { required: true })} className="p-4 bg-slate-50 rounded-xl border outline-none focus:ring-2 ring-blue-500">
                  <option value="">Division</option>
                  {Object.keys(LOCATION_DATA).map(div => <option key={div} value={div}>{div}</option>)}
                </select>
                <select {...register("district", { required: true })} disabled={!selectedDivision} className="p-4 bg-slate-50 rounded-xl border outline-none focus:ring-2 ring-blue-500 disabled:opacity-50">
                  <option value="">District</option>
                  {selectedDivision && LOCATION_DATA[selectedDivision].map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>
              <textarea {...register("address", { required: true })} placeholder="Full Address" className="w-full p-4 rounded-2xl bg-slate-50 h-24 border outline-none focus:ring-2 ring-blue-500" />
              
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl">
                <p className="text-blue-200 text-[10px] font-black uppercase">Total Payment</p>
                <h4 className="text-4xl font-black">৳{totalCost}</h4>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="px-8 font-bold bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-colors">
                  {loading ? "Processing..." : "Confirm & Book Now"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}



