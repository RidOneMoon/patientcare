"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // Track which booking to view
  const router = useRouter();

  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const MASTER_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const MASTER_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (emailInput === MASTER_EMAIL && passInput === MASTER_PASS) {
      setIsAdmin(true);
      sessionStorage.setItem("admin_verified", "true");
      Swal.fire({ title: "Access Granted", icon: "success", timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire("Login Failed", "Invalid Admin Credentials", "error");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_verified") === "true") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/admin/bookings/all");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const updateStatus = async (id, newStatus) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      if(selectedBooking) setSelectedBooking({...selectedBooking, status: newStatus});
      Swal.fire("Success", `Status updated to ${newStatus}`, "success");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-black">
        <form onSubmit={handleAdminLogin} className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black">System Admin</h1>
            <p className="text-slate-500 text-sm">Enter Master Credentials</p>
          </div>
          <div className="space-y-4">
            <input type="email" placeholder="Admin Email" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setEmailInput(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setPassInput(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Unlock</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-900">Admin Management</h1>
          <button onClick={() => { sessionStorage.removeItem("admin_verified"); setIsAdmin(false); }} className="bg-white border px-6 py-2 rounded-xl text-xs font-bold text-red-500">Logout</button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-6">Patient</th>
                <th className="p-6">Service</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50 transition">
                  <td className="p-6">
                    <p className="font-bold">{booking.customerName}</p>
                    <p className="text-xs text-slate-500">{booking.phone}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-sm">{booking.serviceTitle}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{booking.date}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' : 
                      booking.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">{selectedBooking.customerName}</h2>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Order ID: {selectedBooking._id.slice(-6)}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Contact Info</label>
                  <p className="font-bold text-slate-900">{selectedBooking.phone}</p>
                  <p className="text-sm text-slate-500">{selectedBooking.customerEmail}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Identification</label>
                  <p className="font-bold text-blue-600">NID: {selectedBooking.nid}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Full Address</label>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedBooking.address}, {selectedBooking.district}, {selectedBooking.division}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Service Booked</label>
                  <p className="font-black text-slate-900">{selectedBooking.serviceTitle}</p>
                  <p className="text-xs font-bold text-blue-600">{selectedBooking.shift} Shift • {selectedBooking.duration} Days</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Payment Amount</label>
                  <p className="text-2xl font-black text-green-600">৳{selectedBooking.totalCost}</p>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase">Current Status</label>
                    <p className="font-bold">{selectedBooking.status || "Pending"}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t flex gap-4">
              <button 
                onClick={() => updateStatus(selectedBooking._id, "Confirmed")}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition"
              >
                Confirm Booking
              </button>
              <button 
                onClick={() => updateStatus(selectedBooking._id, "Completed")}
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-green-700 transition"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}