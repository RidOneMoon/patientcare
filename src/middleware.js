


import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("firebase-token")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPrivateRoute = pathname.startsWith("/booking") || pathname.startsWith("/my-bookings");

  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking/:path*", "/my-bookings", "/login", "/register"],
};



