"use client";
import { useEffect, useState, use } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import Link from "next/link";

export default function BookingDetailsView({ params }) {
  const resolvedParams = use(params);
  const booking_id = resolvedParams.booking_id;
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (booking_id) {
      fetch(`/api/bookings/${booking_id}`)
        .then((res) => res.json())
        .then((data) => {
          setBooking(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [booking_id]);

  if (loading) return <div className="p-20 text-center text-black font-bold">Generating Receipt...</div>;
  if (!booking) return <div className="p-20 text-center text-black font-bold">Receipt Not Found.</div>;

  const generatedDate = booking.bookedAt 
    ? new Date(booking.bookedAt).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 text-black print:bg-white print:p-0">
      <style jsx global>{`
        @media print {
          nav, footer, header, .no-print, button { display: none !important; }
          body { background: white !important; }
          .receipt-container { 
            margin: 0 !important; 
            padding: 0 !important;
            box-shadow: none !important; 
            border: none !important;
            width: 100% !important;
          }
          @page { margin: 0.5cm; }
        }
      `}</style>

      <div className="max-w-xl mx-auto receipt-container">
        
        <Link href="/my-bookings" className="no-print text-xs font-bold text-slate-400 hover:text-blue-600 mb-4 inline-flex items-center gap-2">
          ← Back to My Bookings
        </Link>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl overflow-hidden print:border-slate-100">
          
          {/* Header - Reduced Padding */}
          <div className="p-6 flex justify-between items-center border-b border-dashed border-slate-200">
            <div>
              <h1 className="text-blue-600 font-black text-2xl tracking-tighter">CARE.XYZ</h1>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Official Invoice</p>
            </div>
            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                booking.status === 'Confirmed' || booking.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'
              }`}>
              {booking.status || "Pending"}
            </div>
          </div>

          <div className="p-8">
            {/* Service Title - Reduced Margin */}
            <div className="text-center mb-6">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Service Provided</p>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{booking.serviceTitle}</h2>
            </div>

            {/* Price Highlight - More Compact */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-50 border border-blue-100 px-8 py-3 rounded-2xl text-center">
                <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest">Amount Paid</p>
                <p className="text-3xl font-black text-blue-600">৳{booking.totalCost}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-5 border-t border-slate-100 pt-6">
              <InfoBlock label="Patient Name" value={booking.customerName} />
              <InfoBlock label="NID Number" value={booking.nid} />
              
              <InfoBlock label="Service Date" value={booking.date} /> 
              <InfoBlock label="Service Shift" value={booking.shift} capitalize />
              
              <InfoBlock label="Contact Number" value={booking.phone} />
              <InfoBlock label="Booking Ref" value={booking._id.slice(-8).toUpperCase()} />
              
              <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                <InfoBlock label="Full Care Address" value={`${booking.address}, ${booking.district}, ${booking.division}`} />
              </div>
            </div>
          </div>

          {/* Footer Section  */}
          <div className="p-6 bg-slate-50/50 border-t flex justify-between items-center">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Generated On</p>
              <p className="text-xs font-bold text-slate-900">{generatedDate}</p>
            </div>
            
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">System Ref</p>
              <p className="text-[10px] font-mono font-bold text-slate-500">{booking._id}</p>
            </div>
          </div>
        </div>

        {/* Action Btn */}
        <div className="mt-6 flex justify-center no-print">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-slate-900 transition-all shadow-lg flex items-center gap-2"
          >
            DOWNLOAD PDF 📄
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-slate-900 font-bold text-sm ${capitalize ? 'capitalize' : ''}`}>
        {value || "---"}
      </p>
    </div>
  );
}