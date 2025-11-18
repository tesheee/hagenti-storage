import { NextResponse } from "next/server";
import { register } from "@/lib/authService";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await register(data);
    return NextResponse.json({ message: "Аккаунт создан" });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании аккаунта" },
      { status: 500 }
    );
  }
}
