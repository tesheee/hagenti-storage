// lib/apiClient.ts
import { useAuthStore } from "@/shared/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const TIMEOUT = 10000; // 10 секунд

async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // httpOnly cookie
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data.accessToken;
    useAuthStore.getState().setAccessToken(token);
    return token;
  } catch (err) {
    console.error("Failed to refresh token", err);
    useAuthStore.getState().logout();
    return null;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  query?: Record<string, any>;
  headers?: HeadersInit;
  retry?: boolean;
}

// Функция для ручной сериализации query params
function serializeQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      if (value === undefined || value === null) return "";
      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");
}

export async function apiClient(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ data?: any; error?: string }> {
  const { method = "GET", body, query, headers = {}, retry = true } = options;
  let url = `${BASE_URL}${endpoint}`;
  const token = useAuthStore.getState().accessToken;

  if (query) {
    const qs = serializeQueryParams(query);
    if (qs) url += `?${qs}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // для cookies
  };

  try {
    const res = await fetchWithTimeout(url, fetchOptions);

    if (res.status === 401 && retry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiClient(endpoint, { ...options, retry: false });
      }
      return { error: "Unauthorized" };
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { error: data?.error || res.statusText || "Ошибка сервера" };
    }

    return { data };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return { error: "Request timed out" };
    }
    return { error: err.message || "Network error" };
  }
}
