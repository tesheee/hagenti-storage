"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import { api } from "@/lib/axiosInstance";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { logout } = useAuthStore();

  const onClickLogout = async () => {
    await api.post("/auth/logout");
    logout();
    router.push("/auth");
  };

  return (
    <div>
      <div className="p-3 m-5 border-b" style={{ borderColor: "#2d3237" }}>
        <button
          onClick={() => onClickLogout()}
          className="text-red-700 font-bold flex gap-2 cursor-pointer"
        >
          Выйти
          <LogOut />
        </button>
      </div>
    </div>
  );
};

export default page;
