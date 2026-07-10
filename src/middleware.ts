import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Uses the edge-safe config only (no Prisma), since middleware runs on the
// Edge runtime. Role is read straight off the JWT, not queried here.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/sign-in", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  if (pathname.startsWith("/account") && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
