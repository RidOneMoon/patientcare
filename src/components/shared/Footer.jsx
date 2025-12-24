
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="bg-blue-600 p-1.5 rounded-lg text-white">✚</span>
              CARE.XYZ
            </Link>
            <p className="mt-6 text-slate-400 leading-relaxed font-medium">
              Providing professional healthcare support at your doorstep. We bridge the gap between quality care and convenience.
            </p>
            <div className="flex gap-4 mt-6">
              {['FB', 'TW', 'LN', 'IG'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold hover:bg-blue-600 transition-all cursor-pointer">
                  {social}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Our Caregivers', 'How it Works'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-300 hover:text-blue-400 font-bold transition-all text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Safety Rules', 'Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-300 hover:text-blue-400 font-bold transition-all text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Stay Updated</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 px-4 rounded-xl text-xs font-black hover:bg-blue-700 transition">
                JOIN
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 leading-tight">
              Get health tips and service updates directly to your inbox.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:grid md:grid-cols-3 items-center gap-4">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest text-center md:text-left">
            Built with Love in Dhaka
          </p>
          <p className="text-slate-400 text-sm font-medium text-center">
            © 2025 Reliable Care Services.
          </p>
          <div className="flex justify-center md:justify-end gap-6 text-[11px] font-black text-slate-500">
             <span className="hover:text-white cursor-pointer transition">SYSTEM STATUS</span>
             <span className="hover:text-white cursor-pointer transition">DOCS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}