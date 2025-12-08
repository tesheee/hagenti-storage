"use client";

import { useState } from "react";
import OrganizationCard from "./components/OrganizationCard";
import { demoOrganizations } from "./demoData";
import { Plus, X } from "lucide-react";

export default function NetworkMapsPage() {
  const [organizations, setOrganizations] = useState(demoOrganizations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");

  const handleCreateOrg = () => {
    if (!orgName.trim()) return;

    const newOrg = {
      id: String(Date.now()),
      name: orgName,
      address: orgAddress || "",
      rooms: [],
    };

    setOrganizations((prev) => [...prev, newOrg]);

    setIsModalOpen(false);
    setOrgName("");
    setOrgAddress("");
  };

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ backgroundColor: "#212529" }}
    >
      <h1 className="text-2xl font-bold text-white mb-2">Карты сетей</h1>
      <p className="text-gray-400 mb-8">
        Выберите организацию или добавьте новую
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* {organizations.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))} */}

        {/* ДОБАВИТЬ ОРГАНИЗАЦИЮ */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            group rounded-xl shadow-sm hover:shadow-md hover:cursor-pointer
            transition-all p-6 text-center border-2 border-dashed
            flex flex-col items-center justify-center min-h-[202px]
          "
          style={{
            backgroundColor: "#1a1d20",
            borderColor: "#2d3237",
            color: "#fff",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-10 h-10 text-gray-400 group-hover:text-green-400 transition-colors" />
            <span className="text-sm text-gray-400 group-hover:text-green-400 transition-colors">
              Добавить организацию
            </span>
          </div>
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className="w-full max-w-md rounded-lg shadow-lg p-6 border"
            style={{ backgroundColor: "#1a1d20", borderColor: "#2d3237" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Новая организация
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Название организации
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#212529] border border-gray-700 text-white focus:border-green-500 outline-none"
                  placeholder="Например: Главный офис"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Адрес (необязательно)
                </label>
                <input
                  type="text"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#212529] border border-gray-700 text-white focus:border-green-500 outline-none"
                  placeholder="г. Москва, ул. Ленина, 15"
                />
              </div>

              <button
                onClick={handleCreateOrg}
                className="
                  w-full py-2 mt-4 rounded-lg font-semibold transition
                  text-white hover:text-green-400 border shadow-sm
                "
                style={{ backgroundColor: "#2d3237", borderColor: "#3a4046" }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
