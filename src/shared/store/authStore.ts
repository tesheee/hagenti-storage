"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCookie } from "../utils/getCookie";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;

  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      // =========================================
      // SIGN UP
      // =========================================
      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) throw new Error("Ошибка регистрации");

          // сразу логиним после регистрации
          const result = await res.json();

          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // =========================================
      // LOGIN
      // =========================================
      login: async (data) => {
        set({ loading: true, error: null });

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) throw new Error("Неверный логин или пароль");

          const result = await res.json();

          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // =========================================
      // REFRESH TOKEN
      // =========================================
      refresh: async () => {
        const token = get().refreshToken;
        if (!token) return;

        try {
          const res = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token }),
          });

          if (!res.ok) throw new Error("Refresh failed");

          const data = await res.json();

          set({
            accessToken: data.accessToken,
            ...(data.refreshToken && { refreshToken: data.refreshToken }),
          });
        } catch {
          get().logout();
        }
      },

      // =========================================
      // LOGOUT
      // =========================================
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      init: async () => {
        const token = getCookie("auth-token");
        const refreshToken = getCookie("refresh-token");

        if (token) {
          try {
            // Можно проверить валидность токена или просто декодировать
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userResponse = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (userResponse.ok) {
              const user = await userResponse.json();
              set({ user, accessToken: token, refreshToken });
            }
          } catch {
            // Токен битый — чистим
            get().logout();
          }
        }
        set({ loading: false });
      },

      setError: (msg) => set({ error: msg }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
