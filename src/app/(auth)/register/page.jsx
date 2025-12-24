






"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthCookie } from "@/lib/auth-utils";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", nid: "", contact: "", password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const nextRoute = searchParams.get("next") || "/booking/baby-care";

  const validatePassword = (pw) => {
    return /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(pw);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(formData.password)) {
      setError("Password: 6+ chars, 1 uppercase, 1 lowercase required.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(res.user, { displayName: formData.name });
      
        await fetch("/api/users/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: res.user.uid,
            email: formData.email,
            name: formData.name,
            nid: formData.nid,
            contact: formData.contact,
          }),
        });


      await setAuthCookie(res.user);

      router.push(nextRoute); 
      router.refresh(); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 rounded-xl text-black"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="NID No" required className="w-full p-4 bg-slate-50 rounded-xl text-black"
              onChange={(e) => setFormData({...formData, nid: e.target.value})} />
            <input type="tel" placeholder="Contact" required className="w-full p-4 bg-slate-50 rounded-xl text-black"
              onChange={(e) => setFormData({...formData, contact: e.target.value})} />
          </div>

          <input type="email" placeholder="Email" required className="w-full p-4 bg-slate-50 rounded-xl text-black"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 rounded-xl text-black" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} />

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all">
            Register & Continue
          </button>
        </form>
      </div>
    </div>
  );
}