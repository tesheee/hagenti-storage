import axios from "axios";
import { useAuthStore } from "@/shared/store/authStore";

// Создаём функцию для получения axios с актуальным токеном
export const createAxiosInstance = () => {
  const token = useAuthStore.getState().accessToken;

  const instance = axios.create({
    baseURL: "https://hagenti-storage-7sez.vercel.app/api", // твой базовый URL
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });

  return instance;
};
