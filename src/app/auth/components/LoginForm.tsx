"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { api } from "@/lib/axiosInstance";

type loginProps = {
  onAuth: () => void;
  onSwitchToSingUp?: () => void;
};

const LoginForm: React.FC<loginProps> = ({ onSwitchToSingUp, onAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log(response);
      login(
        response.data.user,
        response.data.accessToken,
        response.data.expiresIn
      );
      onAuth();
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Вход</h2>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
          style={{
            backgroundColor: "#57d75b",
          }}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-400 text-sm">Еще нет аккаунта? </span>
        <button
          onClick={onSwitchToSingUp}
          className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
        >
          Регистрация
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
