import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  accessTokenExpired,
  adminSessionCookieBase,
  decryptAdminSession,
} from "@/infrastructure/auth/session-token";

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieBase(),
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptAdminSession(token);
  const signedIn = Boolean(session && !accessTokenExpired(session.accessToken));
  const isLoginRoute = pathname === "/admin/login";

  if (!isLoginRoute && !signedIn) {
    if (request.headers.has("next-action")) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    return token ? clearSessionCookie(response) : response;
  }

  if (isLoginRoute && signedIn) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  if (isLoginRoute && token && !signedIn) {
    return clearSessionCookie(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
