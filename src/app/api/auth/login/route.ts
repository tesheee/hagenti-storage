import { NextRequest } from "next/server";
import { login } from "@/lib/authService";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await login(data);

    const cookieStore = await cookies();

    cookieStore.set("auth-token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 минут
      path: "/",
    });

    if (result.refreshToken) {
      cookieStore.set("refresh-token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 дней
        path: "/",
      });
    }

    return Response.json({ user: result.user });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
