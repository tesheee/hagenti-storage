"use client";

import CartridgeTable from "@/app/(protected)/cartridges/components/CartridgeTable";
import type { Cartridge } from "@/shared/types/product";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/store/authStore";
import axios from "axios";

export default function CartridgesPage() {
  const { accessToken } = useAuthStore();

  const fetchCartridges = async (): Promise<Cartridge[]> => {
    const response = await axios.get("http://localhost:3000/api/cartridges", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
      const response = await axios.patch(
        "http://localhost:3000/api/cartridges",
        {
          id,
          ...updateData,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      throw err; // Пробрасываем для UI-обработки
    }
  };

  const handleCartridgeCreate = async (cartridge) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cartridges",
        cartridge,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
