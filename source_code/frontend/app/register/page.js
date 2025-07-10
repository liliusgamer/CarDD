"use client";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token); // Lưu token vào localStorage
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.detail || Object.values(data).flat().join(' ') || "Đăng ký thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">Tạo tài khoản DevShare Lite</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition"
          >
            Đăng ký
          </button>
        </form>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <p className="text-center text-gray-500">Đã có tài khoản? <a href="/login" className="text-purple-600 hover:underline">Đăng nhập</a></p>
      </div>
    </div>
  );
} 