"use client";

import React from "react";
import { LogOut } from "lucide-react";

const page = () => {
  return (
    <div>
      <div className="p-3 m-5 border-b" style={{ borderColor: "#2d3237" }}>
        <button className="text-red-700 font-bold flex gap-2 cursor-pointer">
          Выйти
          <LogOut />
        </button>
      </div>
    </div>
  );
};

export default page;
