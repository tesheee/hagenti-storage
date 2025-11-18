"use client";

import React, { useEffect } from "react";
import { authForms, AuthFormKey } from "@/lib/auth-forms";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";

interface AuthProps {
  view: AuthFormKey;
  extra?: string[];
}

export default function AuthPage({ view, extra = [] }: AuthProps) {
  const Form = authForms[view];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSuccess = () => {
    router.push(redirect);
  };

  if (!Form) {
    return <div className="text-red-400">Форма «{view}» не найдена</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(87, 215, 91, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 60%)",
        backgroundSize: "200% 200%",
        animation: "gradientFlow 12s ease-in-out infinite",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">hagenti.admin</h1>
          <p className="text-gray-400">Система администрирования</p>
        </div>

        {/* Auth Container */}
        <div
          className="rounded-2xl p-8 border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(26, 29, 32, 0.95)",
            borderColor: "#2d3237",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Form
            onSwitchToLogin={() => router.push("/auth/login")}
            onAuth={handleSuccess}
            onSwitchToSingUp={() => router.push("/auth/signup")}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} hagenti. Все права защищены.
        </p>
      </div>
    </div>
  );
}
