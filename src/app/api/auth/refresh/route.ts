// import { NextRequest, NextResponse } from "next/server";
// import User from "@/shared/models/user";
// import { connectDB } from "@/lib/db";
// import { createAccessToken, verifyRefreshToken } from "@/lib/auth/tokens";

// export async function GET(req: NextRequest) {
//   await connectDB();

//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   if (!refreshToken) {
//     return NextResponse.json({ error: "No refresh token" }, { status: 401 });
//   }

//   let payload;
//   try {
//     payload = await verifyRefreshToken(refreshToken);
//   } catch {
//     // Если refresh-токен битый — чистим куку и выгоняем
//     const res = NextResponse.json(
//       { error: "Invalid refresh token" },
//       { status: 401 }
//     );
//     res.cookies.set("refreshToken", "", { maxAge: 0 });
//     return res;
//   }

//   const user = await User.findById(payload.id).lean();
//   if (!user || user.refreshToken !== refreshToken) {
//     return NextResponse.json(
//       { error: "Invalid refresh token" },
//       { status: 401 }
//     );
//   }
//   const newAccessToken = await createAccessToken({
//     id: user._id.toString(),
//     email: user.email,
//     username: user.username ?? null,
//   });

//   return NextResponse.json({
//     accessToken: newAccessToken,
//     user: {
//       id: user._id.toString(),
//       email: user.email,
//       username: user.username ?? null,
//     },
//   });
// }

import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from "@/lib/auth/tokens";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/shared/models/user";

export async function POST(req: NextRequest) {
  await connectDB();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    // 2. Генерируем новый access токен
    const accessToken = await createAccessToken({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // 3. (Опционально) генерируем новый refresh токен
    //const newRefresh = genRefresh({ userId: payload.userId });

    // 4. Кладём новый refresh токен в HttpOnly cookies
    // cookieStore.set("refreshToken", newRefresh, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 60 * 60 * 24 * 7,
    // });

    return Response.json({
      accessToken,
      expiresIn: 15 * 60,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    return Response.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
