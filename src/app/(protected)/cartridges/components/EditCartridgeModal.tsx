"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Cartridge } from "@/shared/types/product";

type CartridgeStatus =
  | "Склад"
  | "В использовании"
  | "На заправке"
  | "Ожидает заправки"
  | "Списан";

type TonerColor = "черный" | "желтый" | "голубой" | "красный";

interface EditCartridgeModalProps {
  cartridge: Cartridge;
  onClose: () => void;
  onSave: (id: string, updateData: Partial<Cartridge>) => void;
}

export function EditCartridgeModal({
  cartridge,
  onClose,
  onSave,
}: EditCartridgeModalProps) {
  const [formData, setFormData] = useState({
    model: cartridge.model || "",
    manufacturer: cartridge.manufacturer || "",
    sku: cartridge.sku || "",
    serial: cartridge.serial || "",
    status: cartridge.status,
    location: cartridge.location || "",
    printerModels: cartridge.printerModels?.join(", ") || "",
    tonerColor: cartridge.tonerColor || "черный",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ model: "" });

  const statuses: CartridgeStatus[] = [
    "Склад",
    "В использовании",
    "На заправке",
    "Ожидает заправки",
    "Списан",
  ];

  const colors: TonerColor[] = ["черный", "желтый", "голубой", "красный"];

  const colorClasses = {
    черный: "bg-gray-500 ring-1 ring-gray-700",
    желтый: "bg-yellow-400 ring-1 ring-yellow-600",
    голубой: "bg-cyan-400 ring-1 ring-cyan-600",
    красный: "bg-red-500 ring-1 ring-red-700",
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.model.trim()) newErrors.model = "Модель обязательна";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    await onSave(cartridge._id, {
      ...formData,
      printerModels: formData.printerModels.split(", ").map((x) => x.trim()),
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-999999 isolate overflow-y-auto">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border"
        style={{ backgroundColor: "#212529", borderColor: "#2d3237" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 flex items-center justify-between border-b z-10"
          style={{ backgroundColor: "#212529", borderColor: "#2d3237" }}
        >
          <h2 className="text-xl font-bold text-gray-100">
            Редактировать картридж
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-200">
          {/* Основная информация */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Модель */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Модель <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: errors.model
                      ? "1px solid #ef4444"
                      : "1px solid #2d3237",
                  }}
                  placeholder="HP CF283A"
                />
                {errors.model && (
                  <p className="text-sm text-red-500 mt-1">{errors.model}</p>
                )}
              </div>

              {/* Производитель */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Производитель
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleChange("manufacturer", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                  placeholder="HP"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                  placeholder="SKU-123456"
                />
              </div>

              {/* Serial */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Серийный номер
                </label>
                <input
                  type="text"
                  value={formData.serial}
                  onChange={(e) => handleChange("serial", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                  placeholder="SN-789012"
                />
              </div>
            </div>
          </div>

          {/* Характеристики */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Характеристики
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Цвет тонера */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Цвет тонера
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange("tonerColor", color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        formData.tonerColor === color
                          ? "bg-[#57d75b]/20 border-[#57d75b] text-[#57d75b]"
                          : "bg-[#1a1d20] border-[#2d3237] text-gray-400 hover:bg-[#24272b]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${colorClasses[color]}`}
                      />
                      <span className="text-sm">{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                      style={{ backgroundColor: "#212529" }}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Модели принтеров */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  Модели принтеров (через запятую)
                </label>
                <input
                  type="text"
                  value={formData.printerModels}
                  onChange={(e) =>
                    handleChange("printerModels", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                  placeholder="HP LaserJet Pro M125, HP M127"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  Расположение
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={{
                    backgroundColor: "#1a1d20",
                    border: "1px solid #2d3237",
                  }}
                  placeholder="Склад, стеллаж A3"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "#2d3237" }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1a1d20] "
              style={{
                backgroundColor: "#212529",
                border: "1px solid #2d3237",
              }}
            >
              Отмена
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-white rounded-lg font-medium shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#57d75b" }}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
