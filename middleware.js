import { NextResponse } from "next/server";
import { isUnverifiedAllowedPath, KYC_COOKIE } from "@/lib/kyc-access";

export function middleware(request) {
  const kyc = request.cookies.get(KYC_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (kyc === "pending" && !isUnverifiedAllowedPath(pathname)) {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  if (kyc === "banned" && !pathname.startsWith("/banned") && !isUnverifiedAllowedPath(pathname)) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\..*).*)"],
};
