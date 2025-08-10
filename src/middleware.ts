import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Set NEXTAUTH_URL dynamically based on request hostname
  process.env.NEXTAUTH_URL = `https://${request.headers.get("host")}`;
  console.log(`Setting NEXTAUTH_URL to: ${process.env.NEXTAUTH_URL}`)

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
