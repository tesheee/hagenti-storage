"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { PageActionsProvider } from "@/shared/components/layout/PageActionsContext";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { expiresAt, refresh } = useAuthStore.getState();

  useEffect(() => {
    const init = async () => {
      await refresh(); // пытаемся получить новый accessToken через HttpOnly refreshToken
    };
    init();
  }, [refresh]);

  useEffect(() => {
    if (!expiresAt) return;

    const delay = expiresAt - Date.now() - 10_000;

    if (delay > 0) {
      const t = setTimeout(() => refresh(), delay);
      return () => clearTimeout(t);
    }
  }, [useAuthStore((s) => s.expiresAt)]);

  return (
    <QueryClientProvider client={queryClient}>
      <PageActionsProvider>{children}</PageActionsProvider>
    </QueryClientProvider>
  );
}
