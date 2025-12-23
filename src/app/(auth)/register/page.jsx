

// "use client";
// import { useState } from "react";
// import { auth } from "@/lib/firebase";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { setAuthCookie } from "@/lib/auth-utils";
// import Link from "next/link";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: "", email: "", nid: "", contact: "", password: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // REQUIREMENT: 6+ characters, 1 uppercase, 1 lowercase 
//   const validatePassword = (pw) => {
//     return /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(pw);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validatePassword(formData.password)) {
//       setError("Password must be at least 6 characters, including one uppercase and one lowercase letter.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
//       // Update Firebase Profile with Name
//       await updateProfile(res.user, { displayName: formData.name });
      
//       // Set Cookie for Middleware persistence 
//       await setAuthCookie(res.user);

//       // REQUIREMENT: Redirect to Booking Page after registration 
//       router.push("/booking/elderly-care"); 
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-6">
//       <div className="max-w-lg w-full bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
//         <h2 className="text-3xl font-black text-center mb-8 text-slate-900">Create Care Account</h2>
        
//         <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="col-span-2">
//             <input 
//               type="text" placeholder="Full Name" required 
//               className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 text-black"
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//           </div>
          
//           <input 
//             type="text" placeholder="NID Number" required 
//             className="p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 text-black"
//             onChange={(e) => setFormData({...formData, nid: e.target.value})}
//           />
          
//           <input 
//             type="tel" placeholder="Contact No" required 
//             className="p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 text-black"
//             onChange={(e) => setFormData({...formData, contact: e.target.value})}
//           />
          
//           <div className="col-span-2">
//             <input 
//               type="email" placeholder="Email" required 
//               className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 text-black"
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//           </div>
          
//           <div className="col-span-2">
//             <input 
//               type="password" placeholder="Password" required 
//               className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 text-black"
//               onChange={(e) => setFormData({...formData, password: e.target.value})}
//             />
//           </div>

//           {error && <p className="col-span-2 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">{error}</p>}

//           <button 
//             disabled={loading}
//             className="col-span-2 bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:bg-slate-300 transition-all mt-4"
//           >
//             {loading ? "Creating Account..." : "Register Now"}
//           </button>
//         </form>

//         <p className="mt-8 text-center text-sm font-medium text-slate-500">
//           Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// }






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
  
  // Requirement: Redirect to the intended booking page or default to a booking path
  const nextRoute = searchParams.get("next") || "/booking/baby-care";

  // Requirement: 6+ characters, 1 uppercase, 1 lowercase 
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
      
      // SAVE EXTRA INFO TO MONGODB
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


      // Sync Cookie for Middleware (Fixes the reload issue)
      await setAuthCookie(res.user);

      // Requirement: Redirect to Booking Page after registration 
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