"use client";

import { useEffect, useState } from "react";
import type { Cartridge } from "@/models/cartridge";

export default function CartridgesPage() {
  const [cartridges, setCartridges] = useState<Cartridge[]>([]);

  useEffect(() => {
    fetch("/api/cartridges")
      .then((res) => res.json())
      .then((data) => setCartridges(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Список картриджей</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Модель</th>
            <th>Цвет</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {cartridges.map((c) => (
            <tr key={String(c._id)}>
              <td>{c.inventoryId}</td>
              <td>{c.model}</td>
              <td>{c.tonerColor}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
