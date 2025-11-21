// app/api/cartridges/route.ts   (или где у тебя лежит)
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";
import Cartridge from "@/shared/models/cartridge";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = await verifyAccessToken(token);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const cartridges = await Cartridge.find({ user: payload.id }) // ← вот так!
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(cartridges);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🔹 Проверка токена
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = await verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 🔹 Получаем данные из тела запроса
    const body = await req.json();
    const {
      inventoryId,
      manufacturer,
      model,
      tonerColor,
      printerModels,
      status,
      receivedAt,
      location,
    } = body;

    // 🔹 Проверка обязательных полей
    if (!inventoryId || !model || !tonerColor) {
      return NextResponse.json(
        { error: "inventoryId, model and tonerColor are required" },
        { status: 400 }
      );
    }

    // 🔹 Создаём новый картридж
    const newCartridge = await Cartridge.create({
      user: payload.id,
      inventoryId,
      manufacturer: manufacturer || "",
      model,
      tonerColor,
      printerModels: Array.isArray(printerModels) ? printerModels : [],
      status: status || "Склад",
      receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
      location: location || "",
    });

    return NextResponse.json(newCartridge, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = await verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid cartridge ID" },
        { status: 400 }
      );
    }

    // Проверяем, что картридж принадлежит именно этому юзеру (защита!)
    const cartridge = await Cartridge.findOne({ _id: id, user: payload.id });
    if (!cartridge) {
      return NextResponse.json(
        { error: "Cartridge not found or access denied" },
        { status: 404 }
      );
    }
    // Обновляем только разрешённые поля (настрой под себя)
    const updatedCartridge = await Cartridge.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json(updatedCartridge);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid or expired token" },
      { status: error.message?.includes("token") ? 401 : 400 }
    );
  }
}
