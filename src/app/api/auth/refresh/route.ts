import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, createAccessToken } from "@/lib/auth/tokens";

console.log("REFRESH SECRET:", process.env.REFRESH_TOKEN_SECRET);

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.log("REF:", refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Верифицируем refresh token
    const { userId } = await verifyRefreshToken(refreshToken);

    // TODO: Получите данные пользователя из БД
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Создаём новый access token
    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}

// Заглушка
async function getUserById(userId: string) {
  return {
    id: userId,
    email: "test@example.com",
    name: "Test User",
    role: "user",
  };
}
