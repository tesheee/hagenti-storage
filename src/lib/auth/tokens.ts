import { JWTPayload, SignJWT, jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret-key-min-32-chars"
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key-min-32-chars"
);

export const ACCESS_TOKEN_EXPIRES = "15m"; // 15 минут
export const REFRESH_TOKEN_EXPIRES = "7d"; // 7 дней

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export async function createAccessToken(
  payload: TokenPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function createRefreshToken(
  payload: TokenPayload
): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    throw new Error("Invalid access token");
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);

    // Обрабатываем оба варианта: id и userId
    const userId = (payload as any).userId || (payload as any).id;

    if (!userId) {
      throw new Error("No user ID in token");
    }

    return { userId };
  } catch (error) {
    console.error("Refresh token verification error:", error);
    throw new Error("Invalid refresh token");
  }
}
