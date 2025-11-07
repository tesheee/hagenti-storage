import React, { useState } from "react";
import { Menu, X, Package, Home, Settings, BarChart } from "lucide-react";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export default function Sidebar({
  activeItem = "cartridges",
  onItemClick,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Главная", icon: Home },
    { id: "cartridges", label: "Картриджи", icon: Package },
    { id: "reports", label: "Отчеты", icon: BarChart },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-all duration-200"
        style={{
          backgroundColor: "#1a1d20",
          border: "1px solid #2d3237",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#57d75b")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2d3237")}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: "#212529",
          borderRight: "1px solid #2d3237",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: "#2d3237" }}>
            <h1 className="text-xl font-bold text-white">Склад</h1>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 font-medium
                    ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }
                  `}
                  style={{
                    backgroundColor: isActive
                      ? "rgba(87, 215, 91, 0.15)" // #57d75b с прозрачностью
                      : "transparent",
                    border: isActive
                      ? "1px solid #57d75b"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 0 12px rgba(87, 215, 91, 0.2)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(87, 215, 91, 0.08)";
                      e.currentTarget.style.borderColor =
                        "rgba(87, 215, 91, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: isActive ? "#57d75b" : "currentColor",
                    }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: "#2d3237" }}>
            <div className="text-xs text-gray-500">Версия 1.0.0</div>
          </div>
        </div>
      </aside>
    </>
  );
}
