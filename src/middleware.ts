import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const access_token = req.cookies.get("access_token");
  const pathName = req.nextUrl.pathname;
  const publicPath = "/sign-in /sign-up";
  const isPublicPath = publicPath.includes(pathName);

  if (isPublicPath) {
    if (access_token?.value) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    if (access_token?.value) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/people",
    "/tags",
    "/tags/:tagId*",
    "/events",
    "/giving",
    "/online-giving",
  ],
};
