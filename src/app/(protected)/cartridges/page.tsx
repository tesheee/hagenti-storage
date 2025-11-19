"use client";

import CartridgeTable from "@/app/(protected)/cartridges/components/CartridgeTable";
import type { Cartridge } from "@/shared/types/product";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/shared/store/authStore";

export default function CartridgesPage() {
  const fetchCartridges = async () => {
    const response = await apiClient.get("cartridges");
    return response.data;
  };
  const { user } = useAuthStore.getState();

  const {
    data: cartridges = [],
    isLoading,
    error,
    refetch, // Для обновления после мутации
  } = useQuery<Cartridge[], Error>({
    queryKey: ["cartridges", user?.id],
    queryFn: fetchCartridges,
    staleTime: 60 * 1000, // 1 минута
    retry: 1,
  });

  const handleCartridgeUpdate = async (
    id: string,
    updateData: Partial<Cartridge>
  ) => {
    try {
      const response = await apiClient.patch("cartridges", {
        id,
        ...updateData,
      });
      console.log(response);
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
