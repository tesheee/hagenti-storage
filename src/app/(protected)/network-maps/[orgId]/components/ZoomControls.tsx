"use client";

import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function ZoomControls({ zoom, setZoom }) {
  return (
    <div
      className="absolute top-20 right-4 flex flex-col gap-2 p-2 border rounded-lg shadow-lg"
      style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
    >
      <button
        onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
        className="p-2 hover:bg-gray-800 rounded"
      >
        <ZoomIn className="w-5 h-5 text-gray-400" />
      </button>

      <div className="text-xs text-center text-gray-400 py-1">
        {Math.round(zoom * 100)}%
      </div>

      <button
        onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
        className="p-2 hover:bg-gray-800 rounded"
      >
        <ZoomOut className="w-5 h-5 text-gray-400" />
      </button>

      <button
        onClick={() => setZoom(1)}
        className="p-2 hover:bg-gray-800 rounded border-t"
        style={{ borderColor: "#2d3237" }}
      >
        <Maximize2 className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
