import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // 1. Define the routes that require authentication
  const isProtectedRoute = path.startsWith("/dashboard");

  // 2. Retrieve the session token from cookies
  // Better Auth uses "better-auth.session_token" by default
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // 3. If trying to access a protected route without a session cookie, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // 4. Optional: If user is ALREADY logged in and tries to go to /login, redirect them to dashboard
  const isAuthRoute = path === "/login" || path === "/register";
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Define which paths the middleware should run on
  matcher: [
    "/dashboard/:path*", // Matches /dashboard and all sub-paths
    "/login",
    "/register"
  ],
};
