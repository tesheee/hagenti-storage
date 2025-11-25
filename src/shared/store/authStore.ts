import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null, expiresIn?: number) => void;
  logout: () => void;
  login: (user: User, accessToken: string, expiresIn: number) => void;
  refresh: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (token, expiresIn) => {
        set({
          accessToken: token,
          expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
        });
      },

      login: (user, accessToken, expiresIn) =>
        set({
          user,
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      refresh: async () => {
        try {
          //   const res = await axios.post(
          //     "https://hagenti-storage-7sez.vercel.app/api/auth/refresh"
          //   );

          const res = await axios.post(
            "http://localhost:3000/api/auth/refresh"
          );

          const data = res.data;

          if (!data || !data.accessToken) {
            get().logout();
            return false;
          }

          set({
            accessToken: data.accessToken,
            user: data.user,
            expiresAt: Date.now() + data.expiresIn * 1000,
            isAuthenticated: true,
          });

          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
