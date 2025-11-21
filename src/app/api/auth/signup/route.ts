import { NextRequest, NextResponse } from "next/server";
import User from "@/shared/models/user";
import { connectDB } from "@/lib/db";
import { createAccessToken, createRefreshToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, username, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Пользователь с таким email зарегистрирован" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    email: email,
    username: username,
    password: hashedPassword,
  });

  const accessToken = await createAccessToken({
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
  });
  const refreshToken = await createRefreshToken({ id: newUser._id.toString() });

  newUser.refreshToken = refreshToken;
  await newUser.save();

  const response = NextResponse.json({
    accessToken,
    expiresIn: 15 * 60,
    user: {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
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
