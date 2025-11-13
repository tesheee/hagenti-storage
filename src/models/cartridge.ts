import { ObjectId } from "mongodb";

export type CartridgeStatus =
  | "Склад"
  | "В использовании"
  | "Ожидает заправки"
  | "На заправке"
  | "Списан";

export interface Cartridge {
  _id?: ObjectId;
  user: ObjectId;
  inventoryId: string;
  manufacturer?: string;
  model: string;
  tonerColor: "черный" | "желтый" | "голубой" | "красный";
  printerModels: string[];
  status: CartridgeStatus;
  receivedAt?: string;
  location?: string;
}

export type CartridgeDTO = Omit<Cartridge, "_id"> & { _id: string };
