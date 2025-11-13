export interface Product {
  id: number | string;
  inventoryId: string;
  manufacturer?: string;
  sku?: string;
  serial?: string;
  status: string;
  location?: string;
  quantity?: number;
  receivedAt?: string; // ISO
}

export type CartridgeStatus =
  | "Склад"
  | "В использовании"
  | "Ожидает заправки"
  | "На заправке"
  | "Списан";

export interface Cartridge extends Product {
  printerModels: string[];
  status: CartridgeStatus;
  tonerColor: "черный" | "желтый" | "голубой" | "красный";
  model: string;
  _id: string;
}
