"use client";

import CartridgeTable from "@/app/(protected)/cartridges/components/CartridgeTable";
import type { Cartridge } from "@/shared/types/product";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store/authStore";
import { api } from "@/lib/axiosInstance";

export default function CartridgesPage() {
  const fetchCartridges = async (): Promise<Cartridge[]> => {
    const response = await api.get("/cartridges");
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
      const response = await api.patch("/cartridges", {
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
      const response = await api.post("/cartridges", cartridge);

      if (!response) {
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
