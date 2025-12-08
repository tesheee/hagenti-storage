"use client";

import { X, MapPin, Network } from "lucide-react";
import ZoomControls from "./ZoomControls";
import { useState } from "react";

export default function MapModal({ room, onClose }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
      {/* HEADER */}
      <div
        className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between border-b shadow-lg"
        style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="font-semibold text-white">{room.name}</h3>
            <p className="text-sm text-gray-400">
              {room.floor} • {room.deviceCount} устройств
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* ZOOM CONTROLS */}
      <ZoomControls zoom={zoom} setZoom={setZoom} />

      {/* CONTENT */}
      <div className="absolute inset-0 top-16 overflow-auto flex items-center justify-center p-4">
        <div
          style={{ transform: `scale(${zoom})` }}
          className="transition-transform duration-200"
        >
          <div
            className="rounded-lg border shadow-2xl p-8 max-w-5xl"
            style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
          >
            <div
              className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#212529", borderColor: "#2d3237" }}
            >
              <div className="text-center">
                <Network className="w-16 h-16 text-green-400 opacity-50 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Карта сети: {room.name}</p>

                {room.mapUrl && (
                  <p className="text-xs text-gray-500 mt-4">
                    URL карты: {room.mapUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
