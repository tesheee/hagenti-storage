"use client";

import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#212529" }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
        <p className="text-gray-400 mb-6">
          У вас нет прав для просмотра этой страницы
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: "#57d75b" }}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
