"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Cartridge } from "@/shared/types/product";

interface EditCartridgeModalProps {
  cartridge: Cartridge;
  onClose: () => void;
  onSave: (id: string | number, data: Partial<Cartridge>) => Promise<void>;
}

export function EditCartridgeModal({
  cartridge,
  onClose,
  onSave,
}: EditCartridgeModalProps) {
  const [formData, setFormData] = useState({
    status: cartridge.status,
    location: cartridge.location || "",
    quantity: cartridge.quantity,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  console.log(cartridge._id);

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(cartridge._id, formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1d20] border border-[#2d3237] rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          Редактирование картриджа
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Статус</label>
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as Cartridge["status"])
              }
              className="w-full mt-1 px-3 py-2 rounded-md border text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
            >
              {[
                "Склад",
                "В использовании",
                "На заправке",
                "Ожидает заправки",
                "Списан",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Расположение</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-300 hover:text-white"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
