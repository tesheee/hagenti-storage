"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import RoomCard from "./components/RoomCard";
import MapModal from "./components/MapModal";
import { demoOrganizations } from "../demoData";

export default function OrgSpacesPage({ params }) {
  const org = demoOrganizations.find((o) => o.id === params.orgId);
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!org) return <div className="text-white p-6">Организация не найдена</div>;

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ backgroundColor: "#212529" }}
    >
      <Link
        href="/maps"
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
      >
        <ArrowLeft /> Назад
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Building2 className="w-6 h-6 text-gray-400" />
        <h1 className="text-2xl font-bold text-white">{org.name}</h1>
      </div>
      {org.address && <p className="text-gray-400 ml-9 mb-6">{org.address}</p>}

      {/* GRID */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {org.rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => setSelectedRoom(room)}
          />
        ))}
      </div> */}

      {selectedRoom && (
        <MapModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}
