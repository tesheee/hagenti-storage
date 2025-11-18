"use client";

import CartridgeTable from "@/app/(protected)/cartridges/components/CartridgeTable";
import type { Cartridge } from "@/shared/types/product";
import { useQuery } from "@tanstack/react-query";

export default function CartridgesPage() {
  const fetchCartridges = async (): Promise<Cartridge[]> => {
    const res = await fetch("/api/cartridges", {
      cache: "no-store", // Если нужно всегда свежие данные
    });

    if (!res.ok) {
      throw new Error("Ошибка при загрузке картриджей");
    }

    return res.json();
  };

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

  const handleCartridgeCreate = async (cartridge) => {
    try {
      const response = await fetch("/api/cartridges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cartridge }),
      });

      if (!response.ok) {
        throw new Error("Не удалось добавить картридж");
      }

      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      throw err; // Пробрасываем для UI-обработки
    }
  };

  return (
    <div>
      <CartridgeTable
        cartridges={cartridges}
        onCartridgeUpdate={handleCartridgeUpdate}
        onCartridgeCreate={handleCartridgeCreate}
      />
    </div>
  );
}
