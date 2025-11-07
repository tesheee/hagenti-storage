import { NextResponse } from "next/server";
import {
  getAllCartridges,
  addCartridge,
  deleteCartridge,
  updateCartridge,
} from "@/lib/cartridgeService";

export async function GET() {
  try {
    const cartridges = await getAllCartridges();
    return NextResponse.json(cartridges);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении картриджей" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await addCartridge(data);
    return NextResponse.json({ message: "Картридж добавлен" });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при добавлении картриджа" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Не указан ID" }, { status: 400 });
    }
    await deleteCartridge(id);
    return NextResponse.json({ message: "Картридж удалён" });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при удалении картриджа" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Не указан ID" }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Нет данных для обновления" },
        { status: 400 }
      );
    }

    await updateCartridge(id, updateData);
    return NextResponse.json({ message: "Картридж обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении картриджа:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении картриджа" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    console.log(id, updateData);

    if (!id) {
      return NextResponse.json({ error: "Не указан ID" }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Нет данных для обновления" },
        { status: 400 }
      );
    }

    await updateCartridge(id, updateData);
    return NextResponse.json({ message: "Картридж обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении картриджа:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении картриджа" },
      { status: 500 }
    );
  }
}
