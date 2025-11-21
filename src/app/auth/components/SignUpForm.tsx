"use client";

import { createAxiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";
import { useState } from "react";

interface SignUpFormProps {
  onAuth: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignUpForm({
  onSwitchToLogin,
  onAuth,
}: SignUpFormProps) {
  const api = createAxiosInstance();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (!response) {
        throw new Error("Ошибка регистрации");
      }

      login(
        response.data.user,
        response.data.accessToken,
        response.data.expiresIn
      );
      onAuth();
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Регистрация</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="p-3 rounded-lg text-sm text-red-400"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Имя
          </label>
          <input
            type="text"
            name="name"
            value={formData.username}
            onChange={handleChange}
            placeholder="Иван Иванов"
            required
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            style={{
              backgroundColor: "#212529",
              border: "1px solid #2d3237",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            style={{
              backgroundColor: "#212529",
              border: "1px solid #2d3237",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Пароль
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            style={{
              backgroundColor: "#212529",
              border: "1px solid #2d3237",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Подтвердите пароль
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            style={{
              backgroundColor: "#212529",
              border: "1px solid #2d3237",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{
            backgroundColor: "#57d75b",
          }}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-400 text-sm">Уже есть аккаунт? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
