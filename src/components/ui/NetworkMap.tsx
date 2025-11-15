"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Monitor,
  Printer,
  X,
  Plus,
  Link2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";

type diviceType = "computer" | "printer" | "switch" | "router";

interface Device {
  id: string;
  name: string;
  type: diviceType;
  ip: string;
  location: string;
  status: "online" | "offline";
  model?: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  animated: boolean;
  status?: "online" | "offline";
}

export default function NetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "sw1",
      name: "Главный коммутатор",
      type: "switch",
      ip: "192.168.0.1",
      location: "Серверная",
      status: "online",
      x: 600,
      y: 300,
    },
    {
      id: "pc1",
      name: "Компьютер Офис",
      type: "computer",
      ip: "192.168.0.101",
      location: "Кабинет 9",
      status: "online",
      x: 400,
      y: 450,
    },
    {
      id: "pc1",
      name: "Компьютер Офис",
      type: "computer",
      ip: "192.168.0.101",
      location: "Кабинет 9",
      status: "online",
      x: 400,
      y: 450,
    },
    {
      id: "pc1",
      name: "Компьютер Офис",
      type: "computer",
      ip: "192.168.0.101",
      location: "Кабинет 9",
      status: "online",
      x: 400,
      y: 450,
    },
    {
      id: "pr1",
      name: "Принтер HP",
      type: "printer",
      ip: "192.168.0.201",
      location: "Офис",
      status: "online",
      x: 800,
      y: 450,
    },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { from: "sw1", to: "pc1", animated: true },
    { from: "sw1", to: "pr1", animated: true },
  ]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({});
  const [linkMode, setLinkMode] = useState(false);
  const [linkStart, setLinkStart] = useState<string | null>(null);
  const [linkStartPos, setLinkStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [linkCurrentPos, setLinkCurrentPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [draggedDevice, setDraggedDevice] = useState<string | null>(null);
  const [animationOffset, setAnimationOffset] = useState(0);

  // Zoom и Pan
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const getDeviceColor = (device: Device) => {
    if (device.status === "offline") return "#475569";
    switch (device.type) {
      case "switch":
        return "#3b82f6";
      case "computer":
        return "#10b981";
      case "printer":
        return "#a78bfa";
      default:
        return "#6b7280";
    }
  };

  const screenToCanvas = (screenX: number, screenY: number) => {
    return {
      x: (screenX - panX) / scale,
      y: (screenY - panY) / scale,
    };
  };

  const getDeviceAtPosition = (x: number, y: number): Device | null => {
    const canvasPos = screenToCanvas(x, y);
    for (const device of devices) {
      const dx = canvasPos.x - device.x;
      const dy = canvasPos.y - device.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= 30) return device;
    }
    return null;
  };

  const getConnectionAtPosition = (x: number, y: number): Connection | null => {
    const canvasPos = screenToCanvas(x, y);
    for (const conn of connections) {
      const from = devices.find((d) => d.id === conn.from);
      const to = devices.find((d) => d.id === conn.to);
      if (!from || !to) continue;

      const distToLine = pointToLineDistance(
        canvasPos.x,
        canvasPos.y,
        from.x,
        from.y,
        to.x,
        to.y
      );
      if (distToLine < 10) return conn;
    }
    return null;
  };

  const pointToLineDistance = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Рисование на canvas с учетом DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Получаем DPI
    const dpr = window.devicePixelRatio || 1;

    // Размеры контейнера
    const rect = container.getBoundingClientRect();

    // Устанавливаем реальный размер canvas с учетом DPI
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // CSS размер остается прежним
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Масштабируем контекст для четкого отображения
    ctx.scale(dpr, dpr);

    // Очистка
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Применяем трансформацию
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    // Фон с сеткой
    ctx.fillStyle = "#1a1d20";
    ctx.fillRect(
      -panX / scale,
      -panY / scale,
      rect.width / scale,
      rect.height / scale
    );

    // Включаем сглаживание для лучшего качества
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Сетка
    ctx.strokeStyle = "#2d3237";
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    const startX = Math.floor(-panX / scale / gridSize) * gridSize;
    const endX = Math.ceil((rect.width - panX) / scale / gridSize) * gridSize;
    const startY = Math.floor(-panY / scale / gridSize) * gridSize;
    const endY = Math.ceil((rect.height - panY) / scale / gridSize) * gridSize;

    for (let i = startX; i <= endX; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, startY);
      ctx.lineTo(i, endY);
      ctx.stroke();
    }
    for (let i = startY; i <= endY; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, i);
      ctx.lineTo(endX, i);
      ctx.stroke();
    }

    // Рисуем соединения
    connections.forEach((conn) => {
      const from = devices.find((d) => d.id === conn.from);
      const to = devices.find((d) => d.id === conn.to);
      if (!from || !to) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = conn.animated ? "#57d75b" : "#475569";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;

      if (conn.animated) {
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -animationOffset;
      } else {
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    });

    // Рисуем линию создания связи (в процессе)
    if (linkMode && linkStart && linkStartPos && linkCurrentPos) {
      const fromDevice = devices.find((d) => d.id === linkStart);
      if (fromDevice) {
        ctx.beginPath();
        ctx.moveTo(fromDevice.x, fromDevice.y);
        ctx.lineTo(linkCurrentPos.x, linkCurrentPos.y);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      }
    }

    // Рисуем устройства
    devices.forEach((device) => {
      const color = getDeviceColor(device);
      const isHovered = hoveredDevice === device.id;
      const isSelected = selectedDevice?.id === device.id;
      const isLinkStart = linkStart === device.id;

      // Свечение для online устройств
      if (device.status === "online") {
        ctx.beginPath();
        ctx.arc(device.x, device.y, 35, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          device.x,
          device.y,
          0,
          device.x,
          device.y,
          35
        );
        gradient.addColorStop(0, color + "40");
        gradient.addColorStop(1, color + "00");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Круг устройства
      ctx.beginPath();
      ctx.arc(device.x, device.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Обводка
      ctx.strokeStyle = isSelected || isLinkStart ? "#57d75b" : color;
      ctx.lineWidth = isSelected || isLinkStart ? 3 : 2;
      ctx.stroke();

      // Иконка (эмодзи)
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const emoji =
        device.type === "switch"
          ? "🔀"
          : device.type === "computer"
          ? "🖥️"
          : "🖨️";
      ctx.fillText(emoji, device.x, device.y);

      // Название
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(device.name.split(" ")[0], device.x, device.y + 50);

      // IP
      ctx.font = "10px Arial";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(device.ip, device.x, device.y + 65);
    });

    ctx.restore();

    // Анимация
    const animationId = requestAnimationFrame(() => {
      setAnimationOffset((prev) => (prev + 0.5) % 10);
    });

    return () => cancelAnimationFrame(animationId);
  }, [
    devices,
    connections,
    hoveredDevice,
    selectedDevice,
    linkStart,
    linkStartPos,
    linkCurrentPos,
    animationOffset,
    scale,
    panX,
    panY,
  ]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 1 || e.ctrlKey || e.metaKey) {
      // Middle mouse button or Ctrl+Click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
      return;
    }

    const device = getDeviceAtPosition(x, y);

    if (linkMode && device) {
      // Начинаем создание связи
      setLinkStart(device.id);
      setLinkStartPos({ x: device.x, y: device.y });
      setLinkCurrentPos({ x: device.x, y: device.y });
    } else if (device && !linkMode) {
      // Обычный режим - перетаскивание
      setDraggedDevice(device.id);
    } else if (!device && !linkMode) {
      const conn = getConnectionAtPosition(x, y);
      if (conn) {
        handleRemoveConnection(conn.from, conn.to);
      } else {
        // Start panning if clicked on empty space
        setIsPanning(true);
        setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
      canvas.style.cursor = "grabbing";
      return;
    }

    if (linkMode && linkStart && linkStartPos) {
      // Обновляем позицию линии создания связи
      const canvasPos = screenToCanvas(x, y);
      setLinkCurrentPos({ x: canvasPos.x, y: canvasPos.y });
      canvas.style.cursor = "crosshair";
    } else if (draggedDevice) {
      const canvasPos = screenToCanvas(x, y);
      setDevices((prev) =>
        prev.map((d) =>
          d.id === draggedDevice ? { ...d, x: canvasPos.x, y: canvasPos.y } : d
        )
      );
    } else {
      const device = getDeviceAtPosition(x, y);
      setHoveredDevice(device?.id || null);
      canvas.style.cursor = device
        ? "pointer"
        : linkMode
        ? "crosshair"
        : "default";
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Завершаем создание связи
    if (linkMode && linkStart) {
      const targetDevice = getDeviceAtPosition(x, y);
      if (targetDevice && targetDevice.id !== linkStart) {
        // Создаем связь между устройствами
        setConnections((prev) => [
          ...prev,
          { from: linkStart, to: targetDevice.id, animated: true },
        ]);
      }
      // Сбрасываем состояние создания связи
      setLinkStart(null);
      setLinkStartPos(null);
      setLinkCurrentPos(null);
    }

    setDraggedDevice(null);
    setIsPanning(false);
    if (canvas) {
      canvas.style.cursor = linkMode ? "crosshair" : "default";
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    const newScale = Math.min(Math.max(0.2, scale * delta), 3);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom to mouse position
    const worldX = (mouseX - panX) / scale;
    const worldY = (mouseY - panY) / scale;

    setPanX(mouseX - worldX * newScale);
    setPanY(mouseY - worldY * newScale);
    setScale(newScale);
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.ip) return;
    const id = `${newDevice.type}_${Date.now()}`;
    const centerX = (600 - panX) / scale;
    const centerY = (300 - panY) / scale;

    setDevices((prev) => [
      ...prev,
      {
        id,
        name: newDevice.name!,
        type: newDevice.type as diviceType,
        ip: newDevice.ip!,
        location: newDevice.location || "Не указано",
        status: "online",
        model: newDevice.model || "",
        x: centerX,
        y: centerY,
      },
    ]);
    setNewDevice({});
    setShowAddModal(false);
  };

  const handleRemoveConnection = (from: string, to: string) => {
    setConnections((prev) =>
      prev.filter((c) => !(c.from === from && c.to === to))
    );
  };

  const handleRemoveDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    setSelectedDevice(null);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.2));
  };

  const handleResetView = () => {
    setScale(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div
      className="w-full h-screen flex"
      style={{ backgroundColor: "#212529" }}
    >
      {/* Canvas Container */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="w-full h-full relative overflow-hidden"
          style={{ backgroundColor: "#1a1d20" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Legend - top left */}
          <div
            className="absolute top-4 left-4 px-3 py-2 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(26, 29, 32, 0.7)",
              border: "1px solid rgba(45, 50, 55, 0.5)",
            }}
          >
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Коммутаторы</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Компьютеры</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                <span className="text-gray-300">Принтеры</span>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-4 left-4 flex flex-col gap-2"
            style={{
              backgroundColor: "#1a1d20",
              border: "1px solid #2d3237",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="p-3 rounded-lg text-white bg-[#57d75b] hover:bg-[#4cc950] transition-all"
              title="Добавить устройство"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setLinkMode((v) => !v);
                setLinkStart(null);
                setLinkStartPos(null);
                setLinkCurrentPos(null);
              }}
              className={`p-3 rounded-lg transition-all ${
                linkMode
                  ? "bg-blue-600 text-white"
                  : "bg-[#24272b] text-gray-300 hover:bg-[#2d3237]"
              }`}
              style={{
                border: linkMode
                  ? "1px solid #3b82f6"
                  : "1px solid transparent",
              }}
              title={linkMode ? "Отменить режим связей" : "Создать связь"}
            >
              <Link2 className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div
            className="absolute bottom-4 right-4 flex flex-col gap-2"
            style={{
              backgroundColor: "#1a1d20",
              border: "1px solid #2d3237",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-300 hover:text-white hover:bg-[#24272b] rounded transition-colors"
              title="Приблизить"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 text-gray-300 hover:text-white hover:bg-[#24272b] rounded transition-colors"
              title="Сбросить вид"
            >
              <Move className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-300 hover:text-white hover:bg-[#24272b] rounded transition-colors"
              title="Отдалить"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="text-center text-xs text-gray-400 mt-1">
              {Math.round(scale * 100)}%
            </div>
          </div>

          {/* Device Info Panel */}
          {selectedDevice && !linkMode && (
            <div
              className="absolute top-4 right-4 p-4 rounded-lg border min-w-[280px]"
              style={{
                backgroundColor: "#1a1d20",
                borderColor: "#2d3237",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold">
                  {selectedDevice.name}
                </h3>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Тип:</span>
                  <span className="text-white">
                    {selectedDevice.type === "switch" && "Коммутатор"}
                    {selectedDevice.type === "computer" && "Компьютер"}
                    {selectedDevice.type === "printer" && "Принтер"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP:</span>
                  <span className="text-white">{selectedDevice.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Локация:</span>
                  <span className="text-white text-right">
                    {selectedDevice.location}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Статус:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      selectedDevice.status === "online"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {selectedDevice.status === "online" ? "Онлайн" : "Офлайн"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveDevice(selectedDevice.id)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Удалить устройство
              </button>
            </div>
          )}

          {/* Link Mode Hint */}
          {linkMode && (
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: "#1a1d20",
                border: "1px solid #3b82f6",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
            >
              <p className="text-sm text-white">
                {linkStart
                  ? "Выберите второе устройство для создания связи"
                  : "Выберите первое устройство"}
              </p>
            </div>
          )}
        </div>

        {/* Add Device Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#212529] p-6 rounded-xl border border-[#2d3237] w-[400px] text-white">
              <h3 className="text-lg font-bold mb-4">Новое устройство</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Название"
                  value={newDevice.name || ""}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={newDevice.type || ""}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      type: e.target.value as diviceType,
                    })
                  }
                  className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Выберите тип</option>
                  <option value="computer">Компьютер</option>
                  <option value="printer">Принтер</option>
                  <option value="switch">Коммутатор</option>
                </select>
                <input
                  type="text"
                  placeholder="IP-адрес"
                  value={newDevice.ip || ""}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, ip: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Расположение"
                  value={newDevice.location || ""}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, location: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewDevice({});
                  }}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddDevice}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
