import React, { useState } from "react";
import {
  Menu,
  Package,
  Home,
  Settings,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MobileMenu from "./MobileMenu";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  badges?: Record<string, number>;
}

export default function Sidebar({
  activeItem = "cartridges",
  onItemClick,
  badges = {},
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const menuItems = [
    { id: "home", label: "Главная", icon: Home },
    { id: "cartridges", label: "Картриджи", icon: Package },
    { id: "reports", label: "Отчеты", icon: BarChart },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
  };

  return (
    <>
      {/* Mobile menu toggle button - visible only on mobile */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-40 p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "#1a1d20",
            border: "1px solid #2d3237",
          }}
        >
          <div className="relative">
            <Menu className="w-6 h-6 text-gray-300" />
            {Object.values(badges).some((v) => v > 0) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </button>
      )}

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        badges={badges}
      />

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block fixed lg:static inset-y-0 left-0 z-40 transition-all duration-300 ease-out"
        style={{
          width: isDesktopCollapsed ? "80px" : "256px",
          backgroundColor: "#212529",
          borderRight: "1px solid #2d3237",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and toggle button */}
          <div
            className={`p-6 border-b flex items-center ${
              isDesktopCollapsed ? "justify-center" : "justify-between"
            }`}
            style={{ borderColor: "#2d3237" }}
          >
            <h1
              className={`text-xl font-bold text-white transition-all duration-300 ${
                isDesktopCollapsed ? "hidden" : ""
              }`}
            >
              Склад
            </h1>

            {/* Toggle button - mobile menu button / desktop collapse button */}
            <button
              onClick={() => {
                // Mobile: toggle mobile menu
                setIsMobileOpen(!isMobileOpen);
                // Desktop: toggle collapse
                setIsDesktopCollapsed(!isDesktopCollapsed);
              }}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 relative"
              style={{
                backgroundColor: "#1a1d20",
                border: "1px solid #2d3237",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(87, 215, 91, 0.15)";
                e.currentTarget.style.borderColor = "#57d75b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1d20";
                e.currentTarget.style.borderColor = "#2d3237";
              }}
            >
              {/* Mobile: show Menu icon */}
              <div className="lg:hidden relative">
                <Menu className="w-5 h-5 text-gray-300 transition-transform duration-300" />
                {Object.values(badges).some((v) => v > 0) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>

              {/* Desktop: show Chevron icons */}
              <div className="hidden lg:block">
                {isDesktopCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const badge = badges[item.id] || 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 font-medium relative
                    ${isDesktopCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : "text-gray-400 hover:text-white hover:scale-105"
                    }
                  `}
                  style={{
                    backgroundColor: isActive
                      ? "rgba(87, 215, 91, 0.15)"
                      : "transparent",
                    border: isActive
                      ? "1px solid #57d75b"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 0 12px rgba(87, 215, 91, 0.2)"
                      : "none",
                    animationDelay: `${index * 50}ms`,
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
                  <div
                    className={`flex items-center gap-3 ${
                      isDesktopCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-110" : ""
                      }`}
                      style={{
                        color: isActive ? "#57d75b" : "currentColor",
                      }}
                    />
                    <span
                      className={`transition-all duration-300 whitespace-nowrap ${
                        isDesktopCollapsed ? "hidden" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Badge */}
                  {badge > 0 && (
                    <span
                      className={`
                        ml-auto flex-shrink-0 flex items-center justify-center
                        text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-white text-green-600"
                            : "bg-red-500 text-white"
                        }
                        ${
                          isDesktopCollapsed
                            ? "absolute top-1 right-1 min-w-[16px] h-4 text-[10px]"
                            : ""
                        }
                      `}
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: "#2d3237" }}>
            <div
              className={`text-xs text-gray-500 transition-all duration-300 ${
                isDesktopCollapsed ? "text-center text-[10px]" : ""
              }`}
            >
              {isDesktopCollapsed ? "v1.0" : "Версия 1.0.0"}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
