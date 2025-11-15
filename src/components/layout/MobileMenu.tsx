"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronDown, Menu } from "lucide-react";
import { menuItem, PageAction } from "./Navigation";
import { usePageActions } from "@/components/layout/PageActionsContext";

interface MobileMenuProps {
  activeItem?: string;
  onItemClick: (item: menuItem) => void;
  badges?: Record<string, number>;
  isWarehouseOpen: boolean;
  menuItems: menuItem[];
  actions?: PageAction[];
}

export default function MobileMenu({
  activeItem = "cartridges",
  onItemClick,
  badges = {},
  isWarehouseOpen,
  menuItems,
}: MobileMenuProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { actions } = usePageActions();

  // Check if any submenu item is active
  const isWarehouseActive =
    activeItem === "cartridges" || activeItem === "hardware";

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
      setIsMobileOpen(false);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, setIsMobileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const onMobileItemClick = (item: menuItem) => {
    onItemClick(item);
    if (!item.hasSubmenu) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile controls - visible only on mobile */}
      <div
        className="lg:hidden fixed top-4 right-4 z-40 flex gap-2 p-2 duration-200 rounded-lg shadow-lg"
        style={{
          backgroundColor: "#1a1d20",
          border: "1px solid #2d3237",
        }}
      >
        {/* Create button */}

        {actions?.map((action, i) => (
          <button
            onClick={action.onClick}
            key={i}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(87, 215, 91, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <action.icon className="w-5 h-5 text-gray-300" />
          </button>
        ))}

        {/* Divider */}
        <div className="w-px bg-[#2d3237]"></div>

        {/* Menu button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 relative"
          style={{
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(87, 215, 91, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Menu className="w-5 h-5 text-gray-300" />
          {Object.values(badges).some((v) => v > 0) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Overlay with animation */}
      <div
        className={`lg:hidden fixed inset-0 bg-black z-30 transition-all duration-300 ${
          isMobileOpen
            ? "opacity-80 backdrop-blur-sm pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(true)}
      />

      {/* Mobile Menu - slides from right */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          lg:hidden fixed inset-y-0 right-0 z-40
          w-80 max-w-[85vw]
          transition-all duration-300 ease-out
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          backgroundColor: "#212529",
          borderLeft: "1px solid #2d3237",
          boxShadow: isMobileOpen ? "-4px 0 24px rgba(0, 0, 0, 0.4)" : "none",
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
              onClick={() => setIsMobileOpen(false)}
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
              const isActive =
                activeItem === item.id ||
                (item.hasSubmenu && isWarehouseActive);
              const badge = badges[item.id] || 0;

              return (
                <div key={item.id}>
                  {/* Main menu item */}
                  <button
                    onClick={() => onMobileItemClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200 font-medium relative
                      ${isActive ? "text-white scale-105" : "text-gray-400"} 
                      hover:text-white hover:scale-105
                    `}
                    style={{
                      backgroundColor: isActive
                        ? "rgba(87, 215, 91, 0.15)"
                        : "transparent",
                      border: `1px solid ${
                        isActive ? "#57d75b" : "transparent"
                      }`,
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
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-110" : ""
                      }`}
                      style={{
                        color: isActive ? "#57d75b" : "currentColor",
                      }}
                    />
                    <span className="flex-1 text-left">{item.label}</span>

                    {/* Submenu indicator */}
                    {item.hasSubmenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isWarehouseOpen ? "rotate-180" : ""
                        }`}
                        style={{
                          color: isActive ? "#57d75b" : "currentColor",
                        }}
                      />
                    )}

                    {/* Badge */}
                    {badge > 0 && !item.hasSubmenu && (
                      <span
                        className={`
                          shrink-0 flex items-center justify-center
                          text-xs font-bold rounded-full min-w-5 h-5 px-1.5
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

                  {/* Submenu */}
                  {item.hasSubmenu && isWarehouseOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.submenu?.map((subitem) => {
                        const SubIcon = subitem.icon;
                        const isSubActive = activeItem === subitem.id;
                        const subBadge = badges[subitem.id] || 0;

                        return (
                          <button
                            key={subitem.id}
                            onClick={() => onMobileItemClick(subitem)}
                            className={`
                              w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg
                              transition-all duration-200 text-sm font-medium
                              ${
                                isSubActive
                                  ? "text-white "
                                  : "text-gray-400 hover:text-white hover:bg-[#1a1d20]"
                              }
                            `}
                          >
                            {/* colored dot */}
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSubActive ? "bg-[#57d75b]" : "bg-gray-500"
                              }`}
                            ></span>
                            <SubIcon
                              className="w-4 h-4 shrink-0"
                              style={{
                                color: isSubActive ? "#57d75b" : "currentColor",
                              }}
                            />
                            <span className="flex-1 text-left">
                              {subitem.label}
                            </span>

                            {/* Submenu badge */}
                            {subBadge > 0 && (
                              <span
                                className={`
                                  flex items-center justify-center
                                  text-xs font-bold rounded-full min-w-[18px] h-4 px-1.5
                                  ${
                                    isSubActive
                                      ? "bg-white text-green-600"
                                      : "bg-red-500 text-white"
                                  }
                                `}
                              >
                                {subBadge > 99 ? "99+" : subBadge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: "#2d3237" }}>
            <div className="text-xs text-gray-500">Версия 1.0.0</div>
          </div>
        </div>

        {/* Swipe indicator */}
        {isMobileOpen && (
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
