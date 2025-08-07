"use client";

import { useRouter } from "next/navigation";
import CatCard from "./cat-card";

export default function mainCard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="bg-red-600 absolute right-10 top-5 hover:opacity-90 text-white px-4 py-2 rounded cursor-pointer"
      >
        Logout
      </button>
      <CatCard />
    </>
  );
}
