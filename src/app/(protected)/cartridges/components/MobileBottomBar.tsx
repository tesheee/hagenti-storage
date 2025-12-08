import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash,
  Filter,
  X,
  RefreshCcw,
} from "lucide-react";
import { Cartridge } from "@/shared/types/cartridge";

interface MobileBottomBarProps {
  cartridges?: Cartridge[];
  selectedIds?: Set<string>;
  openModal?: (cartridge: Cartridge) => void;
  setIsCreateOpen: (open: boolean) => void;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MobileBottomBar({
  cartridges = [],
  selectedIds = new Set(),
  openModal,
  setIsCreateOpen,
  setIsFilterOpen,
  searchQuery,
  setSearchQuery,
}: MobileBottomBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-3 px-4"
      style={{
        backgroundColor: "rgba(33,37,41,0.95)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="relative mt-3" style={{ height: 40 }}>
        {/* ICON BUTTONS */}
        <div
          className={`absolute inset-0 flex items-center justify-between transition-all duration-500 ease-out ${
            isSearchOpen
              ? "opacity-0 scale-75 translate-x-8 pointer-events-none"
              : "opacity-100 scale-100 translate-x-0"
          }`}
        >
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 h-10 transition-all duration-200 hover:scale-[1.07] active:scale-95 flex items-center justify-center rounded-xl"
            style={{ width: 40, backgroundColor: "#1a1d20" }}
          >
            <Search className="text-gray-400" />
          </button>

          {/* CRUD group */}
          <div
            className="flex items-center relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <div
              id="m-hover-bg"
              className="absolute inset-0 pointer-events-none transition-all duration-200 rounded-2xl"
              style={{
                backgroundColor: "transparent",
                backdropFilter: "blur(6px)",
              }}
            />

            <button
              onMouseEnter={(e) => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) {
                  overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                  overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                  overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                }
              }}
              onMouseLeave={() => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) overlay.style.backgroundColor = "transparent";
              }}
              onClick={() => setIsCreateOpen(true)}
              className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
              style={{ width: 40 }}
            >
              <Plus className="text-gray-400" />
            </button>

            <button
              onMouseEnter={(e) => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) {
                  overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                  overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                  overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                }
              }}
              onMouseLeave={() => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) overlay.style.backgroundColor = "transparent";
              }}
              onClick={() => {}}
              disabled
              className={`p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10 ${
                selectedIds.size === 1 ? "" : "opacity-40"
              }`}
              style={{ width: 40 }}
            >
              <RefreshCcw className="text-gray-400" />
            </button>

            <button
              onMouseEnter={(e) => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) {
                  overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                  overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                  overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                }
              }}
              onMouseLeave={() => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) overlay.style.backgroundColor = "transparent";
              }}
              onClick={() => {
                if (selectedIds.size === 1 && openModal) {
                  const id = [...selectedIds][0];
                  const c = cartridges.find((c) => c._id?.toString() === id);
                  if (c) openModal(c);
                }
              }}
              disabled={selectedIds.size !== 1 || !openModal}
              className={`p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10 ${
                selectedIds.size === 1 && openModal ? "" : "opacity-40"
              }`}
              style={{ width: 40 }}
            >
              <Pencil className="text-gray-400" />
            </button>

            <button
              onMouseEnter={(e) => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) {
                  overlay.style.backgroundColor = "rgba(255,0,0,0.15)";
                  overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                  overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                }
              }}
              onMouseLeave={() => {
                const overlay = document.getElementById("m-hover-bg");
                if (overlay) overlay.style.backgroundColor = "transparent";
              }}
              onClick={() => {}}
              disabled={selectedIds.size === 0}
              className={`p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10 ${
                selectedIds.size === 0 ? "opacity-40" : ""
              }`}
              style={{ width: 40 }}
            >
              <Trash className="text-gray-400" />
            </button>
          </div>

          {/* FILTER group */}
          <div
            className="flex items-center relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <div
              id="m-hover-bg-2"
              className="absolute inset-0 pointer-events-none transition-all duration-200 rounded-2xl"
              style={{
                backgroundColor: "transparent",
                backdropFilter: "blur(6px)",
              }}
            />

            <button
              onMouseEnter={(e) => {
                const overlay = document.getElementById("m-hover-bg-2");
                if (overlay) {
                  overlay.style.backgroundColor = "rgba(87,215,91,0.15)";
                  overlay.style.left = `${e.currentTarget.offsetLeft}px`;
                  overlay.style.width = `${e.currentTarget.offsetWidth}px`;
                }
              }}
              onMouseLeave={() => {
                const overlay = document.getElementById("m-hover-bg-2");
                if (overlay) overlay.style.backgroundColor = "transparent";
              }}
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="p-2.5 h-10 transition-all duration-200 flex items-center justify-center relative z-10"
              style={{ width: 40 }}
            >
              <Filter className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div
          className={`absolute inset-0 flex items-center gap-2 transition-all duration-500 ease-out ${
            isSearchOpen
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 -translate-x-8 scale-90 pointer-events-none"
          }`}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по модели, производителю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
              className="w-full h-10 pl-10 pr-4 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-500"
              style={{ backgroundColor: "#1a1d20" }}
            />
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-500 hover:bg-[#2d3237]"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
