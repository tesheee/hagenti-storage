// hooks/useResponsive.ts
import { useState, useEffect } from "react";
import { breakpoints, Breakpoint } from "../utils/breakpoints";

export const useResponsive = () => {
  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "xs";
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>("md");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setBreakpoint(getBreakpoint(width));
    };

    handleResize(); // Инициализация
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = ["xs", "sm"].includes(breakpoint);
  const isTablet = breakpoint === "md";
  const isDesktop = ["lg", "xl", "2xl"].includes(breakpoint);

  return { breakpoint, isMobile, isTablet, isDesktop };
};
