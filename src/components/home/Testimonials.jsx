"use client";

const reviews = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Mother of Two",
    text: "Care.xyz has been a lifesaver. The babysitter we found was professional, punctual, and my kids absolutely loved her!",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 5,
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    role: "Elderly Care User",
    text: "Finding a reliable caretaker for my father was difficult until I used this platform. The NID verification gives me peace of mind.",
    avatar: "https://i.pravatar.cc/150?u=tanvir",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Maria",
    role: "Physician",
    text: "I recommend this service to my patients who need post-surgery care at home. The quality of service is consistently high.",
    avatar: "https://i.pravatar.cc/150?u=maria",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Community Trust</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">What Families Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review} 
              className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{review.text}"</p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}