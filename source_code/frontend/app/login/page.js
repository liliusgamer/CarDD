"use client";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Hàm giải mã JWT (base64 decode payload)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const username = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Giải mã access token để lấy is_staff
        const payload = parseJwt(data.access);
        const is_staff = payload.is_staff === true || payload.is_staff === "true";
        await login(data.access, username, is_staff); // Lưu access token, username, is_staff
        window.location.href = "/home"; // Reload để đồng bộ state đăng nhập
      } else {
        setError("Đăng nhập thất bại! Kiểm tra lại tên đăng nhập/mật khẩu.");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-blue-700">Đăng nhập vào DevShare Lite</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            required
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <p className="text-center text-gray-500">Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a></p>
      </div>
    </div>
  );
} 