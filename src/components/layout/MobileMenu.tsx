import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Package,
  Home,
  Settings,
  BarChart,
  ChevronRight,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
  badges?: Record<string, number>;
}

export default function MobileMenu({
  isOpen,
  onClose,
  activeItem = "cartridges",
  onItemClick,
  badges = {},
}: MobileMenuProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: "home", label: "Главная", icon: Home },
    { id: "cartridges", label: "Картриджи", icon: Package },
    { id: "reports", label: "Отчеты", icon: BarChart },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
    onClose();
  };

  // Swipe gesture handler (swipe right to close)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchEnd - touchStart > 75) {
      // Swipe right
      onClose();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const statusColors = {
    active: {
      bg: "rgba(87, 215, 91, 0.15)",
      border: "#57d75b",
      text: "text-white",
      icon: "#57d75b",
      shadow: "0 0 12px rgba(87, 215, 91, 0.2)",
    },
    inactive: {
      bg: "transparent",
      border: "transparent",
      text: "text-gray-400",
      icon: "currentColor",
      shadow: "none",
    },
  };

  return (
    <>
      {/* Overlay with animation */}
      <div
        className={`lg:hidden fixed inset-0 bg-black z-30 transition-all duration-300 ${
          isOpen
            ? "opacity-80 backdrop-blur-sm pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu - slides from right */}
      <div
        ref={menuRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
    lg:hidden fixed inset-y-0 right-0 z-50
    w-72 max-w-[70vw]
    transition-transform duration-300 ease-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
        style={{
          backgroundColor: "#212529",
          borderLeft: "1px solid #2d3237",
          boxShadow: isOpen ? "-4px 0 24px rgba(0, 0, 0, 0.4)" : "none",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{ borderColor: "#2d3237" }}
          >
            <h1 className="text-xl font-bold text-white">Меню</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
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
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const badge = badges[item.id] || 0;
              const colors = isActive
                ? statusColors.active
                : statusColors.inactive;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 font-medium relative
                    ${colors.text} hover:text-white hover:scale-105
                    ${isActive ? "scale-105" : ""}
                  `}
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
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
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                    style={{
                      color: colors.icon,
                    }}
                  />
                  <span className="flex-1 text-left">{item.label}</span>

                  {/* Badge */}
                  {badge > 0 && (
                    <span
                      className={`
                        flex-shrink-0 flex items-center justify-center
                        text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-white text-green-600"
                            : "bg-red-500 text-white"
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
            <div className="text-xs text-gray-500">Версия 1.0.0</div>
          </div>
        </div>

        {/* Swipe indicator */}
        {isOpen && (
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
            <div className="flex flex-col gap-1 opacity-50">
              <ChevronRight className="w-6 h-6 text-gray-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
