"use client";
import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Package, Edit, Plus } from "lucide-react";
import { Cartridge } from "@/shared/types/product";
import { EditCartridgeModal } from "./EditCartridgeModal";
import AddCartridgeModal, { CartridgeFormData } from "./AddCartridgeModal";
import { useRegisterPageActions } from "@/shared/hooks/useRegisterPageActions";

// ---------- Типы ----------
type CartridgeStatus =
  | "Склад"
  | "В использовании"
  | "На заправке"
  | "Ожидает заправки"
  | "Списан";

interface CartridgeTableProps {
  cartridges: Cartridge[];
  onCartridgeClick?: (cartridge: Cartridge) => void;
  onCartridgeCreate: (cartridge: CartridgeFormData) => void;
  onCartridgeUpdate: (id: string, updateData: Partial<Cartridge>) => void;
}

export default function CartridgeTable({
  cartridges: initialCartridges,
  onCartridgeClick,
  onCartridgeUpdate,
  onCartridgeCreate,
}: CartridgeTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CartridgeStatus | "all">(
    "all"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCartridge, setSelectedCartridge] = useState<Cartridge | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const cartridges = Array.isArray(initialCartridges) ? initialCartridges : [];

  useRegisterPageActions([
    {
      label: "Добавить",
      icon: Plus,
      onClick: () => {
        setIsCreateOpen(true);
      },
    },
  ]);

  const statuses: (CartridgeStatus | "all")[] = [
    "all",
    "Склад",
    "В использовании",
    "На заправке",
    "Ожидает заправки",
    "Списан",
  ];

  const statusLabels = {
    all: "Все статусы",
    Склад: "Склад",
    "В использовании": "В использовании",
    "На заправке": "На заправке",
    "Ожидает заправки": "Ожидает заправки",
    Списан: "Списан",
  };

  const statusColors = {
    Склад: "bg-green-900/30 text-green-400 border border-green-800",
    "В использовании": "bg-blue-900/30 text-blue-400 border border-blue-800",
    "На заправке": "bg-yellow-900/30 text-yellow-400 border border-yellow-800",
    "Ожидает заправки":
      "bg-orange-900/30 text-orange-400 border border-orange-800",
    Списан: "bg-gray-800 text-gray-400 border border-gray-700",
  };

  const tonerColors = {
    черный: "bg-gray-500 ring-1 ring-gray-700",
    желтый: "bg-yellow-400 ring-1 ring-yellow-600",
    голубой: "bg-cyan-400 ring-1 ring-cyan-600",
    красный: "bg-red-500 ring-1 ring-red-700",
  };

  const filteredCartridges = useMemo(() => {
    if (!cartridges.length) return [];

    const query = searchQuery.toLowerCase().trim();

    const result = cartridges.filter((cartridge) => {
      const matchesSearch =
        cartridge.model.toLowerCase().includes(query) ||
        cartridge.inventoryId.toLowerCase().includes(query) ||
        (cartridge.manufacturer?.toLowerCase().includes(query) ?? false) ||
        (cartridge.sku?.toLowerCase().includes(query) ?? false) ||
        (cartridge.serial?.toLowerCase().includes(query) ?? false);

      const matchesStatus =
        statusFilter === "all" || cartridge.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // 🔽 Порядок сортировки статусов
    const statusOrder: Record<string, number> = {
      Склад: 1,
      "В использовании": 2,
      "Ожидает заправки": 3,
      "На заправке": 4,
      Списан: 5,
    };

    // 🔽 Сортировка по статусу
    result.sort((a, b) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return result;
  }, [cartridges, searchQuery, statusFilter]);

  const openModal = (cartridge: Cartridge) => {
    console.log(cartridge);
    setSelectedCartridge(cartridge);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setSelectedCartridge(null);
    setIsEditOpen(false);
  };

  return (
    <div
      className="w-full h-full p-4 lg:p-6"
      style={{ backgroundColor: "#212529" }}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Картриджи</h2>
          <p className="text-gray-400">Всего: {filteredCartridges.length}</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="hidden lg:block p-1.5 mr-8 h-10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "#1a1d20",
            border: "1px solid #2d3237",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(87, 215, 91, 0.15)";
            e.currentTarget.style.borderColor = "#57d75b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#1a1d20";
            e.currentTarget.style.borderColor = "#2d3237";
          }}
        >
          <Plus className="text-gray-500" />
        </button>
      </div>

      {/* Search and Filters */}
      <div
        className="rounded-lg p-4 mb-6 space-y-4 border"
        style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по модели, инв. номеру, производителю..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            style={{
              backgroundColor: "#1a1d20",
              border: "1px solid #2d3237",
            }}
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: "#1a1d20",
              border: `1px solid ${isFilterOpen ? "#57d75b" : "#2d3237"}`,
            }}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">
                {statusLabels[statusFilter]}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFilterOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border overflow-hidden z-10"
              style={{
                backgroundColor: "#1a1d20",
                borderColor: "#2d3237",
                zIndex: 1000,
              }}
            >
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsFilterOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 transition-all hover:bg-[#24272b]"
                  style={{
                    color: statusFilter === status ? "#57d75b" : "#94a3b8",
                    backgroundColor:
                      statusFilter === status
                        ? "rgba(87, 215, 91, 0.1)"
                        : "transparent",
                  }}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {/* Desktop Table */}
      <div
        className="hidden lg:block rounded-xl overflow-hidden border"
        style={{ borderColor: "#2d3237" }}
      >
        <table
          className="w-full min-w-max"
          style={{ backgroundColor: "#212529" }}
        >
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <tr>
              {[
                "Модель",
                "Инв. номер",
                "Цвет",
                "Статус",
                "Совместимость",
                "Расположение",
                "Действия",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCartridges.map((cartridge, key) => (
              <tr
                key={key}
                className="transition-all hover:bg-[#1a1d20]"
                style={{ borderBottom: "1px solid #2d3237" }}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => onCartridgeClick?.(cartridge)}
                >
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {cartridge.model}
                      </div>
                      <div className="text-sm text-gray-400">
                        {cartridge.manufacturer}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {cartridge.inventoryId}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        tonerColors[cartridge.tonerColor]
                      }`}
                    />
                    <span className="text-sm text-gray-300">
                      {cartridge.tonerColor}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                      statusColors[cartridge.status]
                    }`}
                  >
                    {cartridge.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {cartridge.printerModels.map((model, id) => (
                    <p key={id}>{model}</p>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {cartridge.location || "—"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => openModal(cartridge)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCartridges.length === 0 && (
          <div
            className="text-center py-12 text-gray-400"
            style={{ backgroundColor: "#212529" }}
          >
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>Картриджи не найдены</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredCartridges.map((cartridge, key) => (
          <div
            key={key}
            className="rounded-lg border p-4"
            style={{
              backgroundColor: "#1a1d20",
              borderColor: "#2d3237",
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between mb-3 pb-3"
              style={{ borderBottom: "1px solid #2d3237" }}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onCartridgeClick?.(cartridge)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-gray-500 shrink-0" />
                  <h3 className="text-sm font-semibold text-white">
                    {cartridge.model}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 ml-6">
                  {cartridge.manufacturer}
                </p>
              </div>
              <button
                onClick={() => openModal(cartridge)}
                className="p-2 text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="space-y-2">
              {/* Inventory ID */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Инв. номер:</span>
                <span className="text-xs text-gray-200">
                  {cartridge.inventoryId}
                </span>
              </div>

              {/* Color */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Цвет:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      tonerColors[cartridge.tonerColor]
                    }`}
                  />
                  <span className="text-xs text-gray-200">
                    {cartridge.tonerColor}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Статус:</span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    statusColors[cartridge.status]
                  }`}
                >
                  {cartridge.status}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Совместимость:</span>
                <span className="text-xs text-gray-200">
                  {cartridge.printerModels.map((model, id) => (
                    <p key={id}>{model}</p>
                  ))}
                </span>
              </div>

              {/* Location */}
              {cartridge.location && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Расположение:</span>
                  <span className="text-xs text-gray-200">
                    {cartridge.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredCartridges.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>Картриджи не найдены</p>
          </div>
        )}
      </div>

      {/* ---------- Модальное окно создания ---------- */}
      {isCreateOpen && (
        <AddCartridgeModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSave={onCartridgeCreate}
        />
      )}

      {/* ---------- Модальное окно редактирования ---------- */}
      {isEditOpen && selectedCartridge && (
        <EditCartridgeModal
          cartridge={selectedCartridge}
          onClose={closeModal}
          onSave={onCartridgeUpdate}
        />
      )}
    </div>
  );
}
