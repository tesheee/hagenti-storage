"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Package,
  Edit,
  Plus,
  Trash,
  Pencil,
} from "lucide-react";
import { Cartridge } from "@/shared/types/product";
import { EditCartridgeModal } from "./EditCartridgeModal";
import AddCartridgeModal, { CartridgeFormData } from "./AddCartridgeModal";
import CheckboxWithAnimation from "@/shared/components/CheckboxWithAnimation";
import MobileBottomBar from "./MobileBottomBar";

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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCartridge, setSelectedCartridge] = useState<Cartridge | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const cartridges = Array.isArray(initialCartridges) ? initialCartridges : [];

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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCartridges.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCartridges.map((c) => c._id)));
    }
  };

  const isAllSelected =
    selectedIds.size === filteredCartridges.length &&
    filteredCartridges.length > 0;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < filteredCartridges.length;

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
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-50 pb-4"
        style={{
          backgroundColor: "rgba(33,37,41,0.8)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div className="flex justify-between items-center pt-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Картриджи</h2>
            <p className="text-gray-400">
              Всего: {filteredCartridges.length}
              {selectedIds.size > 0 && (
                <span className="ml-3 text-green-400">
                  • Выбрано: {selectedIds.size}
                </span>
              )}
            </p>
          </div>

          {/* MAIN PANEL — pinned to top */}
          <div className="hidden lg:flex items-center mr-4 gap-4">
            {/* ──────────────── Поиск ──────────────── */}
            <button
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
              }}
              className="p-2.5 h-10 transition-all duration-200 hover:scale-[1.07] active:scale-95 flex items-center justify-center rounded-xl"
              style={{ width: 40, backgroundColor: "#1a1d20" }}
            >
              <Search className="text-gray-400" />
            </button>

            {/* ──────────────── CRUD группа ──────────────── */}
            <div
              className="flex items-center relative rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#1a1d20" }}
            >
              {/* Overlay layer */}
              <div
                id="hover-bg"
                className="absolute inset-0 pointer-events-none transition-all duration-200 rounded-2xl"
                style={{
                  backgroundColor: "transparent",
                  backdropFilter: "blur(6px)",
                }}
              />

              {/* Add */}
              <button
                onMouseEnter={(e) => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) {
                    overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                    overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                    overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                  }
                }}
                onMouseLeave={() => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) overlay.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsCreateOpen(true)}
                className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
                style={{ width: 40 }}
              >
                <Plus className="text-gray-400" />
              </button>

              {/* Edit */}
              <button
                onMouseEnter={(e) => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) {
                    overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                    overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                    overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                  }
                }}
                onMouseLeave={() => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) overlay.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsEditOpen(true)}
                className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
                style={{ width: 40 }}
              >
                <Pencil className="text-gray-400" />
              </button>

              {/* Delete */}
              <button
                onMouseEnter={(e) => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) {
                    overlay.style.backgroundColor = "rgba(255,0,0,0.15)";
                    overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                    overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                  }
                }}
                onMouseLeave={() => {
                  const overlay = document.getElementById("hover-bg");
                  if (overlay) overlay.style.backgroundColor = "transparent";
                }}
                onClick={() => {}}
                className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
                style={{ width: 40 }}
              >
                <Trash className="text-gray-400" />
              </button>
            </div>

            {/* ──────────────── Filter/Sort ──────────────── */}
            <div
              className="flex items-center relative rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#1a1d20" }}
            >
              <div
                id="hover-bg-2"
                className="absolute inset-0 pointer-events-none transition-all duration-200 rounded-2xl"
                style={{
                  backgroundColor: "transparent",
                  backdropFilter: "blur(6px)",
                }}
              />

              {/* Filter */}
              <button
                onMouseEnter={(e) => {
                  const overlay = document.getElementById("hover-bg-2");
                  if (overlay) {
                    overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                    overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                    overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                  }
                }}
                onMouseLeave={() => {
                  const overlay = document.getElementById("hover-bg-2");
                  if (overlay) overlay.style.backgroundColor = "transparent";
                }}
                //onClick={() => setIsFilterOpen(true)}
                onClick={() => {
                  console.log(isFilterOpen);
                  setIsFilterOpen((prev) => !prev);
                }}
                className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
                style={{ width: 40 }}
              >
                <Filter className="text-gray-400" />
              </button>

              {/* Sort */}
              {/* <button
                onMouseEnter={(e) => {
                  const overlay = document.getElementById("hover-bg-2");
                  if (overlay) {
                    overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                    overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                    overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                  }
                }}
                onMouseLeave={() => {
                  const overlay = document.getElementById("hover-bg-2");
                  if (overlay) overlay.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
                style={{ width: 40 }}
              >
                <ArrowUpDown className="text-gray-400" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {isSearchOpen && (
        <div
          className="hidden lg:rounded-lg p-4 mb-6 space-y-4 border"
          style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по модели, производителю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              style={{
                backgroundColor: "#1a1d20",
                border: "1px solid #2d3237",
              }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      {/* Desktop Table */}
      <div
        className="hidden lg:block rounded-xl overflow-hidden border"
        style={{ borderColor: "#2d3237" }}
      >
        <table className="w-full" style={{ backgroundColor: "#212529" }}>
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <tr>
              {/* Чекбокс "Выбрать все" */}
              <th className="px-6 py-3 text-left w-12">
                <CheckboxWithAnimation
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "Модель",
                "Цвет",
                "Статус",
                "Совместимость",
                "Расположение",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredCartridges.map((cartridge) => {
              const isSelected = selectedIds.has(cartridge._id);

              return (
                <tr
                  key={cartridge._id}
                  className={`transition-all cursor-pointer ${
                    isSelected ? "bg-green-900/20" : "hover:bg-[#1a1d20]"
                  }`}
                  style={{ borderBottom: "1px solid #2d3237" }}
                  onClick={() => openModal(cartridge)}
                >
                  {/* Чекбокс строки */}
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CheckboxWithAnimation
                      checked={isSelected}
                      onChange={() => {
                        toggleSelect(cartridge._id);
                      }}
                    />
                  </td>

                  {/* Модель + производитель */}
                  <td
                    className="px-6 py-4"
                    onClick={() => onCartridgeClick?.(cartridge)}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-500 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {cartridge.model}
                        </div>
                        <div className="text-xs text-gray-400">
                          {cartridge.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Цвет тонера */}
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

                  {/* Статус */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[cartridge.status]
                      }`}
                    >
                      {cartridge.status}
                    </span>
                  </td>

                  {/* Совместимость (первые 2 модели) */}
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {cartridge.printerModels.slice(0, 2).join(", ")}
                    {cartridge.printerModels.length > 2 && " …"}
                  </td>

                  {/* Расположение */}
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {cartridge.location || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Пустое состояние */}
        {filteredCartridges.length === 0 && (
          <div
            className="text-center py-16 text-gray-400"
            style={{ backgroundColor: "#212529" }}
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">Картриджи не найдены</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 pb-20">
        {filteredCartridges.map((cartridge, key) => {
          const isSelected = selectedIds.has(cartridge._id);
          return (
            <div
              key={key}
              className={`rounded-lg border p-4 transition-all ${
                isSelected
                  ? "border-green-500 bg-green-900/10"
                  : "border-[#2d3237]"
              }`}
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
                <div className="flex items-center justify-between"></div>

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
          );
        })}

        {filteredCartridges.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>Картриджи не найдены</p>
          </div>
        )}
      </div>

      {/* ---------- Mobile Bottom Action Bar (Desktop-style) ---------- */}
      <MobileBottomBar
        setIsFilterOpen={setIsFilterOpen}
        setIsCreateOpen={setIsCreateOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ====================== ГЛОБАЛЬНЫЕ ПОПАПЫ (фильтр + сортировка) ====================== */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4"
          onClick={() => setIsFilterOpen(false)}
          style={{
            top: window.innerWidth >= 1024 ? "5rem" : "21.25rem", // lg:top-18 ~ 4.5rem, top-85 ~ 21.25rem
            left: window.innerWidth >= 1024 ? "61rem" : "0rem",
          }}
        >
          <div
            className="w-full rounded-xl overflow-hidden border shadow-2xl bg-[#1a1d20] border-[#2d3237] sm:w-96"
            onClick={(e) => e.stopPropagation()}
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
        </div>
      )}

      {/* Сортировка — тоже глобальная */}
      {/* {isSortOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4"
          onClick={() => setIsFilterOpen(false)}
          style={{
            top: window.innerWidth >= 1024 ? "5rem" : "24.25rem", // lg:top-18 ~ 4.5rem, top-85 ~ 21.25rem
            left: window.innerWidth >= 1024 ? "61rem" : "2rem",
          }}
        >
          <div
            className="absolute top-18 right-4 w-full max-w-sm rounded-xl overflow-hidden border shadow-2xl bg-[#1a1d20] border-[#2d3237]"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              "По дате добавления ↑",
              "По дате добавления ↓",
              "По модели А→Я",
              "По модели Я→А",
            ].map((order) => (
              <button
                key={order}
                onClick={() => {
                  // твоя логика сортировки
                  setIsSortOpen(false);
                }}
                className="w-full text-left px-4 py-3 transition-all hover:bg-[#24272b] text-slate-300"
              >
                {order}
              </button>
            ))}
          </div>
        </div>
      )} */}

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
