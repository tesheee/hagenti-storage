"use client";

import Sidebar from "@/components/layout/Sidebar";
import CartridgeTable from "@/components/ui/CartridgeTable";
import type { Cartridge } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const fetchCartridges = async (): Promise<Cartridge[]> => {
  const res = await fetch("/api/cartridges", {
    cache: "no-store", // Если нужно всегда свежие данные
  });

  if (!res.ok) {
    throw new Error("Ошибка при загрузке картриджей");
  }

  return res.json();
};

export default function Home() {
  const {
    data: cartridges = [],
    isLoading,
    error,
    refetch, // Для обновления после мутации
  } = useQuery<Cartridge[], Error>({
    queryKey: ["cartridges"],
    queryFn: fetchCartridges,
    staleTime: 60 * 1000, // 1 минута
    retry: 1,
  });

  const handleCartridgeUpdate = async (
    id: string,
    updateData: Partial<Cartridge>
  ) => {
    try {
      const response = await fetch("/api/cartridges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updateData }),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить картридж");
      }

      // Обновляем кэш React Query
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      throw err; // Пробрасываем для UI-обработки
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "#212529", // Основной фон
      }}
    >
      <Sidebar activeItem="cartridges" />
      <main className="flex-1 overflow-auto">
        <CartridgeTable
          cartridges={cartridges}
          onCartridgeClick={(cartridge) => console.log(cartridge)}
          onCartridgeUpdate={handleCartridgeUpdate}
        />
      </main>
    </div>
  );
}
