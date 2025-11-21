"use client";

import React, { useState } from "react";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  Home,
  Settings,
  BarChart,
  Network,
  Printer,
  LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";

export type menuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  url?: string;
  hasSubmenu?: boolean;
  submenu?: menuItem[];
};

export type PageAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string; // опционально
};

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const { user } = useAuthStore();
  console.log(user);

  const menuItems: menuItem[] = [
    { id: "home", label: "Главная", icon: Home, url: "" },
    {
      id: "warehouse",
      label: "Инвентарь",
      icon: Package,
      hasSubmenu: true,
      submenu: [
        {
          id: "cartridges",
          label: "Картриджи",
          icon: Package,
          url: "cartridges",
        },
        { id: "hardware", label: "Техника", icon: Printer, url: "hardware" },
      ],
    },
    {
      id: "network-map",
      label: "Карта сети",
      icon: Network,
      url: "network-map",
    },
    { id: "reports", label: "Отчеты", icon: BarChart, url: "reports" },
    { id: "settings", label: "Настройки", icon: Settings, url: "settings" },
  ];

  const getActiveItem = () => {
    if (pathname === "/") return "home";
    return pathname.slice(1).split("/")[0];
  };

  const [activeItem, setActiveItem] = useState(getActiveItem);

  const handleItemClick = (item: menuItem) => {
    if (item.submenu !== undefined) {
      setIsWarehouseOpen((prev) => !prev);
    } else {
      router.push(`/${item.url}`);
      setActiveItem(item.id);
    }
  };

  return (
    <>
      <Sidebar
        activeItem={activeItem}
        onItemClick={handleItemClick}
        isWarehouseOpen={isWarehouseOpen}
        menuItems={menuItems}
        userData={user || {}}
      />
      <MobileMenu
        activeItem={activeItem}
        onItemClick={handleItemClick}
        isWarehouseOpen={isWarehouseOpen}
        menuItems={menuItems}
        userData={user || {}}
      />
    </>
  );
};

export default Navigation;
