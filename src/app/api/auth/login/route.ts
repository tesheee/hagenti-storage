import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/authService";

console.log("LOGIN SECRET:", process.env.REFRESH_TOKEN_SECRET);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Вот и всё — один вызов, всё внутри
    const { user, accessToken, refreshToken } = await login(body);

    const response = NextResponse.json({
      user,
      accessToken,
    });

    // Устанавливаем refresh токен в HttpOnly куку
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Неверный логин или пароль" },
      { status: 401 }
    );
  }
}
