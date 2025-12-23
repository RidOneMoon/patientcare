"use client";
import Link from "next/link";
import { useAuth } from "@/components/shared/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { setAuthCookie } from "@/lib/auth-utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    await setAuthCookie(null);
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            CARE<span className="text-blue-600">.XYZ</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <Link href="/" className={`${pathname === '/' ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors`}>
              Home
            </Link>
            {user && (
              <Link href="/my-bookings" className={`${pathname === '/my-bookings' ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors`}>
                My Bookings
              </Link>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 pl-4 pr-1.5 py-1.5 rounded-2xl border border-slate-100">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter hidden sm:block">
                  {user.displayName?.split(" ")[0] || 'Member'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-black text-slate-600 hover:text-blue-600 px-2 transition-colors">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div> 
        
        </div>
      </div>
    </nav>
  );
}