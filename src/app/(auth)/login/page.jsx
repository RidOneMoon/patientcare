


"use client";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthCookie } from "@/lib/auth-utils";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams.get("next") || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();

  // --- EMAIL/PASSWORD LOGIN ---
  const onSubmit = async (data) => {
    try {
      const res = await signInWithEmailAndPassword(auth, data.email, data.password);
      await setAuthCookie(res.user);
      router.push(nextRoute);
      router.refresh(); 
    } catch (err) { 
      alert("Invalid Credentials or User not found."); 
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;


      await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          contact: user.phoneNumber || "", 
          nid: "", 
        }),
      });

      await setAuthCookie(user);

      router.push(nextRoute);
      router.refresh();
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black mb-8 text-black text-center">Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              {...register("email", { required: "Email is required" })}
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-slate-50 rounded-xl text-black border focus:outline-none focus:border-slate-400" 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
          </div>

          <div>
            <input 
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              type="password" 
              placeholder="Password" 
              className="w-full p-4 bg-slate-50 rounded-xl text-black border focus:outline-none focus:border-slate-400" 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-black transition">
            Login
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full border border-slate-200 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>Login with Google</span>
        </button>

        <p className="text-center text-slate-600 text-sm">
          Dont have an account?{" "}
          <Link href="/register" className="text-slate-900 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}