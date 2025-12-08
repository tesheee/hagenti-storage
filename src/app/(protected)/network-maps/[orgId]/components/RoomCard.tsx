"use client";

import { MapPin, Network, MoreVertical } from "lucide-react";

export default function RoomCard({ room, onClick }) {
  const clickable = room.mapUrl || room.thumbnail;

  return (
    <button
      disabled={!clickable}
      onClick={clickable ? onClick : undefined}
      className={`group text-left ${
        clickable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div
        className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border-2 ${
          clickable
            ? "border-transparent group-hover:border-green-500"
            : "border-gray-700"
        }`}
      >
        {room.thumbnail ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: room.thumbnail }}
          >
            <Network className="w-12 h-12 text-white opacity-80" />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "#2d3237" }}
          >
            <MapPin className="w-8 h-8 text-gray-500" />
          </div>
        )}

        {clickable && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: "#1a1d20" }}
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {!clickable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xs text-gray-500 px-2 py-1 rounded"
              style={{ backgroundColor: "#1a1d20" }}
            >
              Нет карты
            </span>
          </div>
        )}
      </div>

      <h3 className="font-medium text-sm text-white group-hover:text-green-400 truncate">
        {room.name}
      </h3>
      <p className="text-xs text-gray-400">
        {room.floor} • {room.deviceCount} устройств
      </p>
      {room.updatedAt && (
        <p className="text-xs text-gray-500">{room.updatedAt}</p>
      )}
    </button>
  );
}
