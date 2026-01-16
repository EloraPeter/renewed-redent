// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] ${request.method} ${pathname} | token.id=${token?.id ?? 'none'} | role=${token?.role ?? 'null'}`);

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
      console.log("[Middleware] No token → redirect to login");
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const role = token.role as "student" | "lecturer" | null;

  // No role → ONLY role-select allowed
  if (!role && pathname !== "/role-select") {
    return NextResponse.redirect(new URL("/role-select", request.url));
  }

  if (!role) {
    return NextResponse.next();
  }

  const expectedDashboard = `/dashboard/${role}`;

  // Block role-select once role exists
  if (pathname === "/role-select") {
    return NextResponse.redirect(new URL(expectedDashboard, request.url));
  }

  // Allow shared dashboard pages
  if (pathname.startsWith("/dashboard/settings")) {
    return NextResponse.next();
  }

  // Prevent cross-role access
  if (pathname.startsWith("/dashboard") && !pathname.startsWith(expectedDashboard)) {
    return NextResponse.redirect(new URL(expectedDashboard, request.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};