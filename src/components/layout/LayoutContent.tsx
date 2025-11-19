"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import Navigation from "@/components/layout/Navigation";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {}, []);

  // Публичные маршруты (без навигации)
  const publicRoutes = ["/auth", "/auth/login", "/auth/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "#212529",
      }}
    >
      <Navigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
