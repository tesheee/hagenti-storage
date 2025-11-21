import axios from "axios";
import { useAuthStore } from "@/shared/store/authStore";

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

export const api = axios.create({
  baseURL: "https://hagenti-storage-7sez.vercel.app/api", // твой базовый URL
  //baseURL: "http://localhost:3000/api",
  withCredentials: true, // обязательно! чтобы refreshToken отправлялся в куках
});

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватываем 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // если не 401 — пробрасываем
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Помечаем, чтобы не зациклить
    originalRequest._retry = true;

    const { refresh, logout } = useAuthStore.getState();

    // Если refresh уже идёт — ждём
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          if (!token) resolve(Promise.reject(error));
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    // Иначе запускаем refresh
    isRefreshing = true;

    try {
      const ok = await refresh(); // твоя функция refresh из zustand

      const newToken = useAuthStore.getState().accessToken;
      processQueue(newToken);
      isRefreshing = false;

      if (!ok) throw new Error("Refresh failed");

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(null);
      isRefreshing = false;
      logout();
      return Promise.reject(err);
    }
  }
);
