import { NextRequest, NextResponse } from "next/server";
import User from "@/shared/models/user";
import { connectDB } from "@/lib/db";
import { createAccessToken, createRefreshToken } from "@/lib/auth/tokens";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  const accessToken = await createAccessToken({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  });
  const refreshToken = await createRefreshToken({ id: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  const response = NextResponse.json({
    accessToken,
    expiresIn: 15 * 60,
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username ?? null, // или username → name, как тебе удобнее
    },
  });
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
