import { connectDB } from "@/lib/db";
import { User } from "@/shared/models/user";
import { hashPassword, verifyPassword } from "./auth";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "super-secret-jwt";
const ACCESS_SECRET = process.env.ACCESS_SECRET || "super-secret-jwt";

export const register = async (data: User) => {
  const db = await connectDB();

  const hashedPassword = await hashPassword(data.password);
  const formattedData = {
    ...data,
    password: hashedPassword,
  };

  await db.collection<User>("users").insertOne(formattedData);
};

export const login = async (data: { email: string; password: string }) => {
  const db = await connectDB();

  const user = await db.collection("users").findOne({ email: data.email });
  if (!user) throw new Error("Пользователь не найден");

  const valid = await verifyPassword(data.password, user.password);
  if (!valid) throw new Error("Неверный пароль");

  const safeUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(safeUser, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await db
    .collection<User>("users")
    .updateOne({ _id: user._id }, { $set: { refreshToken } });

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

// export const refresh = async (token: string) => {
//   const db = await connectDB();
//   const users = db.collection<User>("users");

//   try {
//     const payload = jwt.verify(token, REFRESH_SECRET) as { id: string };

//     const user = await
//   } catch (error) {
//     throw new Error("Refresh token истёк или повреждён");
//   }
// };
