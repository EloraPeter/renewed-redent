// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Allow static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public pages
  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/role-select";

  // No session → redirect to login
  if (!token) {
    if (!pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const role = token.role as "student" | "lecturer" | null;

  // No role yet → force role-select
  if (!role) {
    if (pathname !== "/role-select") {
      return NextResponse.redirect(new URL("/role-select", request.url));
    }
    return NextResponse.next();
  }

  const expectedDashboard = `/dashboard/${role}`;

  // Redirect from role-select if role exists
  if (pathname === "/role-select") {
    return NextResponse.redirect(new URL(expectedDashboard, request.url));
  }

  // Redirect root/login/signup to dashboard
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return NextResponse.redirect(new URL(expectedDashboard, request.url));
  }

  // === FIX: Allow shared dashboard pages like /dashboard/settings ===
  if (pathname.startsWith("/dashboard/settings")) {
    return NextResponse.next(); // Explicitly allow settings
  }

  // Correct wrong role-based dashboard (e.g. student trying /dashboard/lecturer)
  if (pathname.startsWith("/dashboard")) {
    if (!pathname.startsWith(expectedDashboard) && !pathname.startsWith("/dashboard/settings")) {
      return NextResponse.redirect(new URL(expectedDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};