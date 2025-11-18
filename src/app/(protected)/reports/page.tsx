"use client";

import React from "react";

const page = () => {
  return (
    <div className="p-3 border-b" style={{ borderColor: "#2d3237" }}>
      <div
        className={`text-[10px] text-gray-500 transition-all duration-300 ${"text-center"}`}
      >
        {"Версия 1.0.0"}
      </div>
    </div>
  );
};

export default page;
