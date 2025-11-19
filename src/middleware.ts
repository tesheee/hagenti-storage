// middleware.ts — АБСОЛЮТНО ПРАВИЛЬНЫЙ, 2025 ГОД
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/api/auth/login", // ← ДОБАВИЛ API ЛОГИНА
  "/api/auth/signup", // ← если будет
  "/api/auth/refresh", // ← ОБЯЗАТЕЛЬНО
  "/api/auth/me", // ← ОБЯЗАТЕЛЬНО
  "/api/auth/logout", // ← когда сделаешь
] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // // 1. Публичные пути — пропускаем ВСЕХ (даже без куки)
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // 2. Всё остальное — защищено
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    // Если это API запрос — возвращаем 401, а не редирект
    if (pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Если это обычная страница — редиректим на логин
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Есть refresh токен — пускаем дальше
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
