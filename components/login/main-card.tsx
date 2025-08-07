"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MainCard() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        router.push("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Error during login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white flex flex-col rounded-xl text-black p-5 w-80">
        <h2 className="mb-4 text-xl font-bold">Login</h2>
        <div className="mb-3">
          <div>username = user1 / password = user1</div>
          <div>username = user2 / password = user2</div>
        </div>
        <input
          className="mb-3 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="mb-3 p-2 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-sky-950 hover:opacity-90 py-2 cursor-pointer text-white rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
        {message && (
          <div className="mt-3 text-center text-red-600">{message}</div>
        )}
      </div>
    </div>
  );
}
