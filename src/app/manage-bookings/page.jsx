"use client";
import { useEffect, useState } from "react";

export default function AdminManagePage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings/all") 
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Admin: Update Booking Status</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Customer</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Current Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td className="border p-2">{b.customerEmail}</td>
              <td className="border p-2">{b.serviceTitle}</td>
              <td className="border p-2 font-bold">{b.status}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => updateStatus(b._id, "Confirmed")} className="bg-blue-500 text-white px-3 py-1 rounded">Confirm</button>
                <button onClick={() => updateStatus(b._id, "Completed")} className="bg-green-500 text-white px-3 py-1 rounded">Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}