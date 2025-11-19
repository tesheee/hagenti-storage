import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: User, accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    devtools((set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (token) => set({ accessToken: token }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    })),
    {
      name: "auth-storage",
      //Сохраняем только user, НЕ сохраняем accessToken в localStorage
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
