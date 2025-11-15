import React, { useState } from "react";
import { X } from "lucide-react";
import { Cartridge } from "@/models/cartridge";

type CartridgeStatus =
  | "Склад"
  | "В использовании"
  | "На заправке"
  | "Ожидает заправки"
  | "Списан";
type TonerColor = "черный" | "желтый" | "голубой" | "красный";

export type CartridgeFormData = Omit<
  Cartridge,
  "_id" | "user" | "printerModels"
> & {
  printerModels: string; // вводим как строку в input
  sku?: string;
  serial?: string;
};

interface AddCartridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CartridgeFormData) => void;
}

export default function AddCartridgeModal({
  isOpen,
  onClose,
  onSave,
}: AddCartridgeModalProps) {
  const [formData, setFormData] = useState<CartridgeFormData>({
    inventoryId: "",
    manufacturer: "",
    sku: "",
    serial: "",
    status: "Склад",
    location: "",
    printerModels: "",
    tonerColor: "черный",
    model: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CartridgeFormData, string>>
  >({});

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

  const handleChange = (
    field: keyof CartridgeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CartridgeFormData, string>> = {};

    if (!formData.inventoryId.trim()) {
      newErrors.inventoryId = "Инвентарный номер обязателен";
    }
    if (!formData.model.trim()) {
      newErrors.model = "Модель обязательна";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        printerModels: formatStringToArray(formData.printerModels),
      });
      handleClose();
    }
  };

  const formatStringToArray = (string) => {
    return string.split(", ");
  };

  console.log(formatStringToArray(formData.printerModels));

  const handleClose = () => {
    setFormData({
      inventoryId: "",
      manufacturer: "",
      sku: "",
      serial: "",
      status: "Склад",
      location: "",
      printerModels: "",
      tonerColor: "черный",
      model: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 isolate overflow-y-auto">
      {/* Затемнение без blur */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal — #212529 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border"
          style={{
            backgroundColor: "#212529",
            borderColor: "#2d3237",
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 px-6 py-4 flex items-center justify-between border-b z-10"
            style={{
              backgroundColor: "#212529",
              borderColor: "#2d3237",
            }}
          >
            <h2 className="text-xl font-bold text-gray-100">
              Добавить картридж
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-gray-200">
            {/* Основная информация */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Основная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Инвентарный номер <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inventoryId}
                    onChange={(e) =>
                      handleChange("inventoryId", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    style={{
                      backgroundColor: "#1a1d20",
                      border: errors.inventoryId
                        ? "1px solid #ef4444"
                        : "1px solid #2d3237",
                    }}
                    placeholder="INV-001"
                  />
                  {errors.inventoryId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.inventoryId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
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
                    <p className="mt-1 text-sm text-red-500">{errors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Производитель
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      handleChange("manufacturer", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    style={{
                      backgroundColor: "#1a1d20",
                      border: "1px solid #2d3237",
                    }}
                    placeholder="HP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    style={{
                      backgroundColor: "#1a1d20",
                      border: "1px solid #2d3237",
                    }}
                    placeholder="SKU-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Серийный номер
                  </label>
                  <input
                    type="text"
                    value={formData.serial}
                    onChange={(e) => handleChange("serial", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border ${
                          formData.tonerColor === color
                            ? "bg-[#57d75b]/20 border-[#57d75b] text-[#57d75b] shadow-lg shadow-[#57d75b]/20"
                            : "bg-[#1a1d20] border-[#2d3237] text-gray-400 hover:bg-[#24272b] hover:border-[#57d75b]/50"
                        }`}
                        style={{
                          borderWidth: "1px",
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${colorClasses[color]}`}
                        />
                        <span className="text-sm">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Модели принтеров (через запятую)
                  </label>
                  <input
                    type="text"
                    value={formData.printerModels}
                    onChange={(e) =>
                      handleChange("printerModels", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    style={{
                      backgroundColor: "#1a1d20",
                      border: "1px solid #2d3237",
                    }}
                    placeholder="HP LaserJet Pro M125, HP LaserJet Pro M127"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Расположение
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    style={{
                      backgroundColor: "#1a1d20",
                      border: "1px solid #2d3237",
                    }}
                    placeholder="Склад, стеллаж А3"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              className="flex gap-3 justify-end pt-4 border-t"
              style={{ borderColor: "#2d3237" }}
            >
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-400 rounded-lg transition-all hover:bg-[#1a1d20] hover:text-gray-200"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid #2d3237",
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
                style={{
                  backgroundColor: "#57d75b",
                  boxShadow: "0 4px 12px rgba(87, 215, 91, 0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4cc950")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#57d75b")
                }
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
