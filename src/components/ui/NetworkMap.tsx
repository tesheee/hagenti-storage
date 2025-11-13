// "use client";
// import React, { useState } from "react";
// import { Monitor, Printer, Network, X, Plus, Link2 } from "lucide-react";

// interface Device {
//   id: string;
//   name: string;
//   type: "computer" | "printer" | "switch";
//   ip: string;
//   location: string;
//   status: "online" | "offline";
//   model?: string;
//   x: number;
//   y: number;
// }

// interface Connection {
//   from: string;
//   to: string;
//   animated: boolean;
// }

// export default function NetworkMap() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [connections, setConnections] = useState<Connection[]>([]);
//   const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
//   const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newDevice, setNewDevice] = useState<Partial<Device>>({});
//   const [linkMode, setLinkMode] = useState(false);
//   const [linkStart, setLinkStart] = useState<string | null>(null);

//   const getDeviceColor = (device: Device) => {
//     if (device.status === "offline") return "#475569";
//     switch (device.type) {
//       case "switch":
//         return "#3b82f6";
//       case "computer":
//         return "#10b981";
//       case "printer":
//         return "#a78bfa";
//       default:
//         return "#6b7280";
//     }
//   };

//   const getDeviceIcon = (type: string) => {
//     switch (type) {
//       case "switch":
//         return Network;
//       case "computer":
//         return Monitor;
//       case "printer":
//         return Printer;
//       default:
//         return Monitor;
//     }
//   };

//   // ➕ Добавление нового устройства
//   const handleAddDevice = () => {
//     if (!newDevice.name || !newDevice.type || !newDevice.ip) return;
//     const id = `${newDevice.type}_${Date.now()}`;
//     setDevices((prev) => [
//       ...prev,
//       {
//         id,
//         name: newDevice.name!,
//         type: newDevice.type as any,
//         ip: newDevice.ip!,
//         location: newDevice.location || "Не указано",
//         status: "online",
//         x: Math.random() * 800 + 100,
//         y: Math.random() * 400 + 100,
//       },
//     ]);
//     setNewDevice({});
//     setShowAddModal(false);
//   };

//   // 🔗 Создание связи
//   const handleDeviceClick = (device: Device) => {
//     if (linkMode) {
//       if (!linkStart) {
//         setLinkStart(device.id);
//       } else if (linkStart === device.id) {
//         setLinkStart(null);
//       } else {
//         setConnections((prev) => [
//           ...prev,
//           { from: linkStart, to: device.id, animated: true },
//         ]);
//         setLinkStart(null);
//       }
//     } else {
//       setSelectedDevice(device);
//     }
//   };

//   // ❌ Удаление связи
//   const handleRemoveConnection = (from: string, to: string) => {
//     setConnections((prev) =>
//       prev.filter((c) => !(c.from === from && c.to === to))
//     );
//   };

//   return (
//     <div
//       className="w-full h-full flex flex-col"
//       style={{ backgroundColor: "#212529" }}
//     >
//       {/* Header */}
//       <div
//         className="p-4 border-b flex justify-between items-center"
//         style={{ borderColor: "#2d3237" }}
//       >
//         <h2 className="text-2xl font-bold text-white">Карта сети</h2>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white bg-[#57d75b] hover:bg-[#4cc950] transition-all"
//           >
//             <Plus className="w-4 h-4" /> Устройство
//           </button>
//           <button
//             onClick={() => setLinkMode((v) => !v)}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
//               linkMode
//                 ? "bg-blue-600 text-white"
//                 : "bg-[#1a1d20] text-gray-300 hover:bg-[#24272b]"
//             }`}
//           >
//             <Link2 className="w-4 h-4" /> {linkMode ? "Режим связей" : "Связи"}
//           </button>
//         </div>
//       </div>

//       {/* Карта сети */}
//       <div
//         className="flex-1 relative overflow-auto p-8"
//         style={{ backgroundColor: "#1a1d20" }}
//       >
//         <svg width="1200" height="600" className="mx-auto">
//           <defs>
//             <pattern
//               id="grid"
//               width="20"
//               height="20"
//               patternUnits="userSpaceOnUse"
//             >
//               <path
//                 d="M 20 0 L 0 0 0 20"
//                 fill="none"
//                 stroke="#2d3237"
//                 strokeWidth="0.5"
//               />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid)" />

//           {/* Connections */}
//           {connections.map((conn, idx) => {
//             const from = devices.find((d) => d.id === conn.from);
//             const to = devices.find((d) => d.id === conn.to);
//             if (!from || !to) return null;
//             return (
//               <line
//                 key={idx}
//                 x1={from.x}
//                 y1={from.y}
//                 x2={to.x}
//                 y2={to.y}
//                 stroke={conn.animated ? "#57d75b" : "#475569"}
//                 strokeWidth="2"
//                 strokeDasharray={conn.animated ? "5,5" : "none"}
//                 opacity="0.7"
//                 onClick={() => handleRemoveConnection(conn.from, conn.to)}
//                 style={{ cursor: "pointer" }}
//               />
//             );
//           })}

//           {/* Devices */}
//           {devices.map((device) => {
//             const color = getDeviceColor(device);
//             const isSelected = selectedDevice?.id === device.id;
//             return (
//               <g
//                 key={device.id}
//                 transform={`translate(${device.x}, ${device.y})`}
//                 onClick={() => handleDeviceClick(device)}
//                 onMouseEnter={() => setHoveredDevice(device.id)}
//                 onMouseLeave={() => setHoveredDevice(null)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <circle
//                   r="30"
//                   fill={color}
//                   stroke={isSelected ? "#57d75b" : color}
//                   strokeWidth="3"
//                 />
//                 <text textAnchor="middle" dy="0.3em" fill="white" fontSize="20">
//                   {device.type === "switch" && "🔀"}
//                   {device.type === "computer" && "🖥️"}
//                   {device.type === "printer" && "🖨️"}
//                 </text>
//                 <text textAnchor="middle" dy="50" fill="white" fontSize="12">
//                   {device.name.split(" ")[0]}
//                 </text>
//               </g>
//             );
//           })}
//         </svg>
//       </div>

//       {/* Add device modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-[#212529] p-6 rounded-xl border border-[#2d3237] w-[400px] text-white">
//             <h3 className="text-lg font-bold mb-4">Новое устройство</h3>
//             <div className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Название"
//                 value={newDevice.name || ""}
//                 onChange={(e) =>
//                   setNewDevice({ ...newDevice, name: e.target.value })
//                 }
//                 className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237] focus:ring focus:ring-green-500"
//               />
//               <select
//                 value={newDevice.type || ""}
//                 onChange={(e) =>
//                   setNewDevice({ ...newDevice, type: e.target.value as any })
//                 }
//                 className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237]"
//               >
//                 <option value="">Тип устройства</option>
//                 <option value="computer">Компьютер</option>
//                 <option value="printer">Принтер</option>
//                 <option value="switch">Коммутатор</option>
//               </select>
//               <input
//                 type="text"
//                 placeholder="IP-адрес"
//                 value={newDevice.ip || ""}
//                 onChange={(e) =>
//                   setNewDevice({ ...newDevice, ip: e.target.value })
//                 }
//                 className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237]"
//               />
//               <input
//                 type="text"
//                 placeholder="Расположение"
//                 value={newDevice.location || ""}
//                 onChange={(e) =>
//                   setNewDevice({ ...newDevice, location: e.target.value })
//                 }
//                 className="w-full px-3 py-2 rounded bg-[#1a1d20] border border-[#2d3237]"
//               />
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
//               >
//                 Отмена
//               </button>
//               <button
//                 onClick={handleAddDevice}
//                 className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
//               >
//                 Добавить
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
