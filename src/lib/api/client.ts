import { useAuthStore } from "@/shared/store/authStore";

// Типы для конфигурации
export interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  body?: any;
}

// Типы для ответов
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Типы ошибок
export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: HeadersInit;
  onUnauthorized?: () => void;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: HeadersInit;
  private refreshPromise: Promise<string> | null = null;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL =
      config.baseURL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api";
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.onUnauthorized = config.onUnauthorized;
  }

  /**
   * Создание AbortController с таймаутом
   */
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  /**
   * Построение полного URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    // Если endpoint уже полный URL, используем его
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      const url = new URL(endpoint);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      return url.toString();
    }

    // Нормализуем baseURL и endpoint
    const base = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    const fullURL = `${base}/${path}`;
    const url = new URL(fullURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Подготовка заголовков
   */
  private prepareHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(this.defaultHeaders);

    if (customHeaders) {
      const custom = new Headers(customHeaders);
      custom.forEach((value, key) => headers.set(key, value));
    }

    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  }

  /**
   * Обработка тела запроса
   */
  private prepareBody(
    body: any,
    headers: Headers
  ): string | FormData | undefined {
    if (!body) return undefined;

    if (body instanceof FormData) {
      headers.delete("Content-Type"); // браузер сам поставит boundary
      return body;
    }

    return JSON.stringify(body); // ← ПРОСТО И ЧИСТО
  }

  /**
   * Парсинг ответа
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      return response.text() as any;
    }

    return response.blob() as any;
  }

  /**
   * Обновление access token
   */
  private async refreshAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new ApiError("Failed to refresh token", response.status);
    }

    const data = await response.json();
    return data.accessToken;
  }

  /**
   * Обработка неавторизованного доступа
   */
  private handleUnauthorized(): void {
    useAuthStore.getState().logout();

    if (this.onUnauthorized) {
      this.onUnauthorized();
    } else if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Основной метод запроса
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      body,
      headers: customHeaders,
      method = "GET",
      timeout = this.timeout,
      signal,
      ...restConfig
    } = config;

    const state = useAuthStore.getState();
    const userId = state.user?.userId;
    const accessToken = state.accessToken;

    // Подготовка
    const url = this.buildURL(endpoint, params);
    const headers = this.prepareHeaders(customHeaders);

    if (userId) {
      headers.set("x-user-id", userId);
    }
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const requestBody = this.prepareBody(body, headers, method);

    console.log("API Request:", {
      endpoint,
      baseURL: this.baseURL,
      finalUrl: url,
      method,
    });

    // AbortController для таймаута
    const timeoutController = this.createAbortController(timeout);
    const combinedSignal = signal || timeoutController.signal;

    // Выполнение запроса
    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        credentials: "include",
        signal: combinedSignal,
        ...restConfig,
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }
      throw new ApiError(error.message || "Network error");
    }

    // Обработка 401
    if (response.status === 401 && endpoint !== "/auth/refresh") {
      try {
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken();
        }

        const newAccessToken = await this.refreshPromise;
        this.refreshPromise = null;

        useAuthStore.getState().setAccessToken(newAccessToken);

        // Повторный запрос
        headers.set("Authorization", `Bearer ${newAccessToken}`);

        response = await fetch(url, {
          method,
          headers,
          body: requestBody,
          credentials: "include",
          signal: combinedSignal,
          ...restConfig,
        });
      } catch (refreshError) {
        this.handleUnauthorized();
        throw new ApiError("Authentication failed", 401);
      }
    }

    // Обработка ошибок
    if (!response.ok) {
      const errorData = await this.parseResponse(response).catch(() => null);
      const message =
        errorData?.error || errorData?.message || `HTTP ${response.status}`;
      throw new ApiError(message, response.status, errorData);
    }

    // Успешный ответ
    const data = await this.parseResponse<T>(response);

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  // Convenience методы
  async get<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "body" | "method">
  ) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, { ...config, body, method: "POST" });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, { ...config, body, method: "PUT" });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, { ...config, body, method: "PATCH" });
  }

  async delete<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "body" | "method">
  ) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, {
      ...config,
      body: formData,
      method: "POST",
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient({
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
  baseURL: undefined,
});

export { ApiClient };
