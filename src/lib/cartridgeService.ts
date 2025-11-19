import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/db";
import { Cartridge, CartridgeDTO } from "@/shared/models/cartridge";

// Получить все
export const getAllCartridges = async (
  userId: string
): Promise<CartridgeDTO[]> => {
  const db = await connectDB();

  const cartridges = await db
    .collection<Cartridge>("cartridges")
    .find({ user: new ObjectId(userId) })
    .toArray();

  return cartridges.map((c) => ({
    ...c,
    _id: c._id!.toString(),
    user: c.user.toString(),
  }));
};

// Добавить
export const addCartridge = async (data: Cartridge) => {
  const db = await connectDB();
  await db.collection<Cartridge>("cartridges").insertOne(data);
};

// Удалить по ID
export const deleteCartridge = async (id: string) => {
  const db = await connectDB();
  await db.collection("cartridges").deleteOne({ _id: new ObjectId(id) });
};

export const updateCartridge = async (
  id: string,
  updateData: Partial<Cartridge>
) => {
  const db = await connectDB();
  await db
    .collection<Cartridge>("cartridges")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
};
