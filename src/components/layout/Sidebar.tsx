"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { menuItem } from "./Navigation";
import Image from "next/image";
import { User } from "@/shared/models/user";

interface SidebarProps {
  activeItem?: string;
  onItemClick: (item: menuItem) => void;
  badges?: Record<string, number>;
  isWarehouseOpen: boolean;
  menuItems: menuItem[];
  userData: Partial<User>;
}

export default function Sidebar({
  badges = {},
  activeItem,
  onItemClick,
  isWarehouseOpen,
  menuItems,
  userData,
}: SidebarProps) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const isWarehouseActive =
    activeItem === "cartridges" || activeItem === "hardware";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block fixed lg:static inset-y-0 left-0 z-40 transition-all duration-300 ease-out"
        style={{
          width: isDesktopCollapsed ? "64px" : "220px",
          backgroundColor: "#212529",
          borderRight: "1px solid #2d3237",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and toggle button */}
          <div
            className={`p-4 border-b flex items-center ${
              isDesktopCollapsed ? "justify-center" : "justify-between"
            }`}
            style={{ borderColor: "#2d3237" }}
          >
            <h1
              className={`text-lg font-bold text-white transition-all duration-300 ${
                isDesktopCollapsed ? "hidden" : ""
              }`}
            >
              Управление
            </h1>

            {/* Toggle button - desktop collapse button only */}
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="p-1.5 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
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
              {isDesktopCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
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
                    onClick={() => onItemClick(item)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
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
                      className={`flex items-center gap-2.5 flex-1 ${
                        isDesktopCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-110" : ""
                        }`}
                        style={{
                          color: isActive ? "#57d75b" : "currentColor",
                        }}
                      />
                      <span
                        className={`text-sm transition-all duration-300 whitespace-nowrap ${
                          isDesktopCollapsed ? "hidden" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Submenu indicator */}
                    {item.hasSubmenu && !isDesktopCollapsed && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isWarehouseOpen ? "rotate-180" : ""
                        }`}
                        style={{
                          color: isActive ? "#57d75b" : "currentColor",
                        }}
                      />
                    )}

                    {/* Badge */}
                    {badge > 0 && (
                      <span
                        className={`
                          shrink-0 flex items-center justify-center
                          text-xs font-bold rounded-full min-w-[18px] h-4 px-1.5
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-white text-green-600"
                              : "bg-red-500 text-white"
                          }
                          ${
                            isDesktopCollapsed
                              ? "absolute top-0.5 right-0.5 min-w-5 h-3.5 text-[9px]"
                              : ""
                          }
                        `}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.hasSubmenu &&
                    isWarehouseOpen &&
                    !isDesktopCollapsed && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.submenu?.map((subitem) => {
                          const SubIcon = subitem.icon;
                          const isSubActive = activeItem === subitem.id;
                          const subBadge = badges[subitem.id] || 0;

                          return (
                            <button
                              key={subitem.id}
                              onClick={() => onItemClick(subitem)}
                              className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg
            transition-all duration-200 text-sm font-medium
            ${
              isSubActive
                ? "text-white"
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
                                className="w-3.5 h-3.5 shrink-0"
                                style={{
                                  color: isSubActive
                                    ? "#57d75b"
                                    : "currentColor",
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
                text-[10px] font-bold rounded-full min-w-4 h-3.5 px-1
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
          <div>
            <div className="p-3 border-t" style={{ borderColor: "#2d3237" }}>
              <div
                className={`text-[10px] text-gray-500 flex gap-3 transition-all duration-300 ${
                  isDesktopCollapsed
                    ? "flex-col items-center justify-center"
                    : "items-center"
                }`}
              >
                {/* <Image
                  src={""}
                  alt="avatar"
                  width={35}
                  height={35}
                  className="rounded-full shrink-0" // важно, чтобы картинка не сжималась
                /> */}

                {/* Текст показываем только когда НЕ свернуто */}
                {!isDesktopCollapsed && (
                  <p className="truncate">{userData.username}</p>
                )}
              </div>
            </div>
            <div className="p-3 border-t" style={{ borderColor: "#2d3237" }}>
              <div
                className={`text-[10px] text-gray-500 transition-all duration-300 ${
                  isDesktopCollapsed ? "text-center" : ""
                }`}
              >
                {isDesktopCollapsed ? "v1.0" : "Версия 1.0.0"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
