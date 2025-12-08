"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  Network,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function OrganizationCard({ org, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative group rounded-xl p-6 border shadow-sm hover:shadow-md transition-all bg-[#1a1d20] border-[#2d3237]">
      {/* Основная ссылка — кликабельная карточка (кроме зоны с меню) */}
      <Link
        href={`/${org.id}`}
        className="absolute inset-0 z-0"
        aria-label={`Перейти к организации ${org.name}`}
      />

      {/* Контент карточки */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-[rgba(87,215,91,0.1)]">
          <Building2 className="w-6 h-6 text-green-400" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
        {org.name}
      </h3>

      {org.address && (
        <p className="text-gray-400 text-sm mb-3">{org.address}</p>
      )}

      <div className="flex items-center gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {org.rooms.length} помещений
        </span>
        <span className="flex items-center gap-1">
          <Network className="w-4 h-4" />
          {org.rooms.filter((r) => r.mapUrl || r.thumbnail).length} карт
        </span>
      </div>

      <div className="absolute bottom-6 right-6">
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
      </div>

      {/* Кнопка с тремя точками (в правом верхнем углу) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={(e) => {
            e.preventDefault(); // ← важно! чтобы не срабатывал переход по карточке
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Действия"
        >
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* Popup-меню */}
        {menuOpen && (
          <>
            {/* Затемнение фона при открытом меню */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMenuOpen(false)}
            />

            <div className="absolute right-0 top-10 w-48 py-2 bg-[#25292e] border border-[#3d4248] rounded-lg shadow-xl z-40">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(org);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Редактировать
              </button>

              <hr className="border-[#3d4248] my-1" />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm(`Удалить организацию «${org.name}»?`)) {
                    onDelete?.(org.id);
                  }
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
