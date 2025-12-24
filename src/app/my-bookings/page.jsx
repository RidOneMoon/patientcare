

"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); 
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`/api/bookings?email=${user.email}`);
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Error fetching:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBookings(bookings.filter((b) => b._id !== id));
          Swal.fire("Cancelled!", "Your booking has been removed.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Could not cancel booking", "error");
      }
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === "All" ? true : (b.status || "Pending") === filter
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-slate-500">Loading your care tracker...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Booking Tracker</h1>
          <p className="text-slate-500 mt-2">Manage and track your active care schedules.</p>
        </div>
        
        {/* TRACKING FILTERS */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {["All", "Pending", "Confirmed", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                filter === status ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm">
          <div className="text-6xl mb-6">📂</div>
          <p className="text-slate-400 font-bold text-xl">No {filter !== "All" ? filter.toLowerCase() : ""} bookings found.</p>
          <Link href="/" className="mt-8 inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold">
            Start New Booking
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                
                {/* 1. SERVICE INFO */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {booking.serviceTitle}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">ID: {booking._id.slice(-6)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Scheduled Date</p>
                      <p className="font-bold text-slate-900">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Shift Type</p>
                      <p className="font-bold text-slate-900 capitalize">{booking.shift} Shift</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Cost</p>
                      <p className="font-black text-blue-600">৳{booking.totalCost}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-center md:text-left">Service Progress</p>
                   <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          booking.status === 'Confirmed' ? 'w-2/3 bg-blue-500' :
                          booking.status === 'Completed' ? 'w-full bg-green-500' : 'w-1/3 bg-amber-400'
                        }`}
                      ></div>
                   </div>
                   <div className="flex justify-between mt-2">
                      <span className={`text-[9px] font-bold ${(booking.status === 'Pending' || !booking.status) ? 'text-amber-600' : 'text-slate-400'}`}>Requested</span>
                      <span className={`text-[9px] font-bold ${booking.status === 'Confirmed' ? 'text-blue-600' : 'text-slate-400'}`}>Assigned</span>
                      <span className={`text-[9px] font-bold ${booking.status === 'Completed' ? 'text-green-600' : 'text-slate-400'}`}>Finished</span>
                   </div>
                   <p className="mt-3 text-center md:text-left text-[10px] font-black text-blue-600 uppercase italic tracking-widest">
                      {booking.status || 'Pending'}
                   </p>
                </div>

                {/* 3. ACTIONS */}
                <div className="flex gap-3 w-full md:w-auto">
                  {(booking.status === "Pending" || !booking.status) && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="flex-1 md:flex-none border-2 border-red-50 text-red-500 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => router.push(`/my-bookings/${booking._id}`)} 
                    className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-xs hover:bg-blue-600 transition"
                  >
                    Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}