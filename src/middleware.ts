import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Публичные маршруты
  const publicPaths = ["/auth", "/403"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Проверяем наличие токена в cookies
  const token = request.cookies.get("auth-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;

  if (!token) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
