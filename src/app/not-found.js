import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-9xl font-black text-blue-600">404</h1>
      <h2 className="text-3xl font-bold mt-4">Oops! Page Not Found</h2>
      <p className="text-slate-500 mt-2 max-w-md">
        The service or page you are looking for does not exist. Let get you back to safety.
      </p>
      <Link 
        href="/" 
        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
      >
        Return to Homepage
      </Link>
    </div>
  );
}